import { WebSocket } from "ws";
import {
  EXIT_GAME,
  GAME_ADDED,
  GAME_ALERT,
  GAME_ENDED,
  GAME_JOINED,
  GAME_NOT_FOUND,
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
  private pendingGameId: string | null;

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingGameId = null;
  }

  addUser(user: User) {
    this.users.push(user);
    this.users.map((u) => console.log("userr: ", u.userId));
    this.addHandler(user);
  }

  removeUser(socket: WebSocket) {
    const user = this.users.find((u) => u.socket === socket);
    if (!user) {
      console.log("No user found");
      return;
    }
    this.users = this.users.filter((u) => u.socket !== user.socket);
    socketManager.removeUser(user);
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((game) => game.gameId !== gameId);
  }

  private addHandler(user: User) {
    console.log("we are comming here");
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      console.log("message: ", message);
      if (message.type === INIT_GAME) {
        if (this.pendingGameId) {
          const game = this.games.find((x) => x.gameId === this.pendingGameId);
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
          console.log("second player");
          socketManager.addUser(user, game.gameId);
          await game.updateSecondPlayer(user.userId);
          this.pendingGameId = null;
        } else {
          console.log("we are not comming here");
          const game = new Game(user.userId, null);
          this.games.push(game);
          this.pendingGameId = game.gameId;
          socketManager.addUser(user, game.gameId);
          console.log("first player");
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
              },
            })
          );
          return;
        }

        if (!availableGame) {
          const game = new Game(
            gameFromDb.whitePlayerId,
            gameFromDb.blackPlayerId,
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
              player1TimeConsumed: availableGame.getPlayer1TimeConsumed(),
              player2TimeConsumed: availableGame.getPlayer2TimeConsumed(),
              currentFen: gameFromDb.currentFen,
            },
          })
        );

        socketManager.addUser(user, gameId);
      }
    });
  }
}
