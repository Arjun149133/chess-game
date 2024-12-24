import { WebSocket } from "ws";
import {
  DRAW_ACCEPT,
  DRAW_OFFER,
  DRAW_REJECT,
  EXIT_GAME,
  GAME_ADDED,
  GAME_ALERT,
  GAME_ENDED,
  GAME_JOINED,
  GAME_NOT_FOUND,
  GAME_TYPE,
  INIT_GAME,
  JOIN_ROOM,
  MOVE,
} from "./message";
import { Game } from "./Game";
import { User } from "./User";
import { socketManager } from "./SocketManager";
import { db } from "./db";

export class GameManager {
  private games: Game[];
  private users: User[];
  private pendingGameId: Map<GAME_TYPE, string | null>;

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingGameId = new Map<GAME_TYPE, string | null>();
  }

  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
  }

  removeUser(socket: WebSocket) {
    const user = this.users.find((u) => u.socket === socket);
    if (!user) {
      return;
    }
    this.users = this.users.filter((u) => u.socket !== user.socket);
    socketManager.removeUser(user);
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((game) => game.gameId !== gameId);
  }

  private addHandler(user: User) {
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      console.log("message: ", message);
      if (message.type === INIT_GAME) {
        console.log("player2 game type: ", message.payload.game_type);
        if (
          this.pendingGameId.get(message.payload.game_type) &&
          !message.payload.playingFriend
        ) {
          console.log("pending game found");
          const game = this.games.find(
            (x) =>
              x.gameId === this.pendingGameId.get(message.payload.game_type)
          );
          if (!game) {
            console.error("Pending game not found?");
            return;
          }
          if (user.userId === game.player1UserId) {
            socketManager.broadcast(
              game.gameId,
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: "Trying to connect to yourself?",
                },
              })
            );
            return;
          }
          socketManager.addUser(user, game.gameId);
          await game.updateSecondPlayer(user.userId);
          this.pendingGameId.set(message.payload.game_type, null);
        } else {
          console.log("player1 game type: ", message.payload.game_type);
          const game = new Game(
            user.userId,
            null,
            message.payload.game_type as GAME_TYPE
          );
          this.games.push(game);
          if (!message.payload.playingFriend) {
            this.pendingGameId.set(message.payload.game_type, game.gameId);
          }
          socketManager.addUser(user, game.gameId);
          socketManager.broadcast(
            game.gameId,
            JSON.stringify({
              type: GAME_ADDED,
              payload: {
                gameId: game.gameId,
              },
            })
          );
        }
      }

      if (message.type === MOVE) {
        const gameId = message.payload.gameId;
        const game = this.games.find((x) => x.gameId === gameId);
        if (!game) {
          console.error("There was no game found to make a move"); //TODO: error handling
          return;
        }
        game.makeMove(user, message.payload.move);
        if (game.result) {
          this.removeGame(game.gameId);
        }
      }

      if (message.type === DRAW_OFFER) {
        const gameId = message.payload.gameId;
        const game = this.games.find((x) => x.gameId === gameId);
        if (!game) {
          console.error("There was no game found to make a move"); //TODO: error handling
          return;
        }
        game.drawOffer(user);
      }

      if (message.type === DRAW_ACCEPT) {
        const gameId = message.payload.gameId;
        const game = this.games.find((x) => x.gameId === gameId);
        if (!game) {
          console.error("There was no game found to make a move"); //TODO: error handling
          return;
        }
        game.drawAccept();
        this.removeGame(game.gameId);
      }

      if (message.type === DRAW_REJECT) {
        const gameId = message.payload.gameId;
        const game = this.games.find((x) => x.gameId === gameId);
        if (!game) {
          console.error("There was no game found to make a move"); //TODO: error handling
          return;
        }
        game.drawReject();
      }

      if (message.type === EXIT_GAME) {
        const gameId = message.payload.gameId;
        const game = this.games.find((g) => g.gameId === gameId);

        if (!game) {
          console.error("There was no game found to exit");
          return;
        }
        game.exitGame(user);
        this.removeGame(game.gameId);
      }

      if (message.type === JOIN_ROOM) {
        const gameId = message.payload.gameId;
        if (!gameId) return;

        let availableGame = this.games.find((game) => game.gameId === gameId);
        const gameFromDb = await db.game.findUnique({
          where: {
            id: gameId,
          },
          include: {
            moves: {
              orderBy: {
                moveNumber: "asc",
              },
            },
            blackPlayer: true,
            whitePlayer: true,
          },
        });

        if (availableGame && !availableGame.player2UserId) {
          socketManager.addUser(user, availableGame.gameId);
          await availableGame.updateSecondPlayer(user.userId);
          return;
        }

        if (!gameFromDb) {
          user.socket.send(
            JSON.stringify({
              type: GAME_NOT_FOUND,
            })
          );
          return;
        }

        if (gameFromDb.status !== "IN_PROGRESS") {
          user.socket.send(
            JSON.stringify({
              type: GAME_ENDED,
              payload: {
                result: gameFromDb.result,
                status: gameFromDb.status,
                moves: gameFromDb.moves,
                blackPlayer: {
                  id: gameFromDb.blackPlayer.id,
                  username: gameFromDb.blackPlayer.username,
                },
                whitePlayer: {
                  id: gameFromDb.whitePlayer.id,
                  username: gameFromDb.whitePlayer.username,
                },
                currentFen: gameFromDb.currentFen,
                game_type: gameFromDb.timeControl,
                player1TimeConsumed: gameFromDb.player1TimeConsumed,
                player2TimeConsumed: gameFromDb.player2TimeConsumed,
              },
            })
          );
          return;
        }

        if (!availableGame) {
          const game = new Game(
            gameFromDb.whitePlayerId,
            gameFromDb.blackPlayerId,
            gameFromDb.timeControl as unknown as GAME_TYPE,
            gameFromDb.id,
            gameFromDb.startAt
          );

          game.seedMoves(gameFromDb.moves || []);
          this.games.push(game);
          availableGame = game;
        }

        user.socket.send(
          JSON.stringify({
            type: GAME_JOINED,
            payload: {
              gameId,
              moves: gameFromDb.moves,
              blackPlayer: {
                id: gameFromDb.blackPlayer.id,
                username: gameFromDb.blackPlayer.username,
              },
              whitePlayer: {
                id: gameFromDb.whitePlayer.id,
                username: gameFromDb.whitePlayer.username,
              },
              currentFen: gameFromDb.currentFen,
              game_type: gameFromDb.timeControl,
            },
          })
        );

        socketManager.addUser(user, gameId);
      }
    });
  }
}
