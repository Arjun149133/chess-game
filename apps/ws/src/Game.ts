import { Chess, Move, Square } from "chess.js";
import { GAME_ENDED, GAME_TYPE, INIT_GAME, MOVE, PLAYER_TIME } from "./message";
import { randomUUID } from "crypto";
import { MoveType } from "./types";
import { User } from "./User";
import { socketManager } from "./SocketManager";
import { db } from "./db";
import { returnsTime } from "./utils";

type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
type GAME_STATUS =
  | "PLAYER_EXIT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "TIME_UP";

export function isPromoting(chess: Chess, from: Square, to: Square) {
  if (!from) return false;

  const piece = chess.get(from);

  // Ensure the piece is a pawn and it's the correct player's turn
  if (piece.type !== "p") return false;
  if (piece.color !== chess.turn()) return false;

  // Ensure the destination square is in the promotion rank (1st or 8th)
  const promotionRank = piece.color === "w" ? "8" : "1"; // White promotes to 8th rank, Black to 1st rank
  if (!to.endsWith(promotionRank)) return false;

  // Check if the move is valid and is a promotion move
  const validMoves = chess.moves({ square: from, verbose: true });
  return validMoves.some((move) => move.to === to && move.promotion);
}

export class Game {
  public gameId: string;
  public player1UserId: string;
  public player2UserId: string | null;
  public board: Chess;
  private moveCount = 0;
  private timer: NodeJS.Timeout | null = null;
  private moveTimer: NodeJS.Timeout | null = null;
  public result: GAME_RESULT | null = null;
  private player1TimeConsumed = 0;
  private player2TimeConsumed = 0;
  private startTime = new Date(Date.now());
  private lastMoveTime = new Date(Date.now());
  private player1TimeCount;
  private player2TimeCount;
  private game_type;
  static intervalId: NodeJS.Timeout | null = null;
  private playerTurn: 1 | 2 = 1;

  constructor(
    player1UserId: string,
    player2UserId: string | null,
    game_type: GAME_TYPE,
    gameId?: string,
    startTime?: Date
  ) {
    this.gameId = gameId ?? randomUUID();
    this.player1UserId = player1UserId;
    this.player2UserId = player2UserId;
    this.board = new Chess();
    this.game_type = game_type;
    console.log("game_type in constructor: ", game_type);
    this.player1TimeCount = returnsTime(game_type);
    console.log("player1TimeCount: ", this.player1TimeCount);
    this.player2TimeCount = returnsTime(game_type);
    console.log("player2TimeCount: ", this.player2TimeCount);
    if (startTime) {
      this.startTime = startTime;
      this.lastMoveTime = startTime; // seems wrong
    }
  }

  seedMoves(moves: MoveType[]) {
    moves.forEach((move) => {
      if (isPromoting(this.board, move.from as Square, move.to as Square)) {
        this.board.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
      } else {
        this.board.move({
          from: move.from,
          to: move.to,
        });
      }
    });
    this.moveCount = moves.length;
    if (moves[this.moveCount - 1]) {
      this.lastMoveTime = moves[this.moveCount - 1].createdAt;
    }

    moves.map((move, index) => {
      if (move.timeTaken) {
        if (index % 2 === 0) {
          this.player1TimeConsumed += move.timeTaken;
        } else {
          this.player2TimeConsumed += move.timeTaken;
        }
      }
    });
    this.resetAbandonTimer();
  }

  async updateSecondPlayer(player2UserId: string) {
    this.player2UserId = player2UserId;

    const users = await db.user.findMany({
      where: {
        id: {
          in: [this.player1UserId, this.player2UserId ?? ""],
        },
      },
    });

    try {
      await this.createGameInDb();
    } catch (error) {
      console.error(error);
      return;
    }

    const whitePlayer = users.find((user) => user.id === this.player1UserId);
    const blackPlayer = users.find((user) => user.id === this.player2UserId);

    socketManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          gameId: this.gameId,
          whitePlayer: {
            username: whitePlayer?.username,
            id: this.player1UserId,
            isGuest: whitePlayer?.provider === "Guest",
          },
          blackPlayer: {
            username: blackPlayer?.username,
            id: this.player2UserId,
            isGuest: blackPlayer?.provider === "Guest",
          },
          currenFen: this.board.fen(),
          moves: [],
          game_type: this.game_type,
        },
      })
    );
    this.sendPlayer1TimeCount();
  }

  async createGameInDb() {
    this.startTime = new Date(Date.now());
    this.lastMoveTime = this.startTime;
    console.log("game_type in createGameInDb: ", this.game_type);
    const game = await db.game.create({
      data: {
        id: this.gameId,
        timeControl: this.game_type as unknown as
          | "CLASSICAL"
          | "BLITZ"
          | "RAPID"
          | "BULLET",
        status: "IN_PROGRESS",
        startAt: this.startTime,
        currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        whitePlayer: {
          connect: {
            id: this.player1UserId,
          },
        },
        blackPlayer: {
          connect: {
            id: this.player2UserId ?? "",
          },
        },
      },
      include: {
        whitePlayer: true,
        blackPlayer: true,
      },
    });
    this.gameId = game.id;
  }

  async addMoveToDb(move: Move, moveTimeStamp: Date) {
    try {
      await db.$transaction([
        db.move.create({
          data: {
            gameId: this.gameId,
            moveNumber: this.moveCount + 1,
            from: move.from,
            to: move.to,
            createdAt: moveTimeStamp,
            timeTaken: moveTimeStamp.getTime() - this.lastMoveTime.getTime(),
          },
        }),

        db.game.update({
          data: {
            currentFen: this.board.fen(),
          },
          where: {
            id: this.gameId,
          },
        }),
      ]);
    } catch (error) {
      console.error("error while adding move to db: ", error);
    }
  }

  async makeMove(user: User, move: Move) {
    if (this.board.turn() === "w" && user.userId !== this.player1UserId) return;
    if (this.board.turn() === "b" && user.userId !== this.player2UserId) return;
    console.log("turn: ", this.board.turn());
    console.log("user1: ", this.player1UserId, " || ", user.userId);
    console.log("user2: ", this.player2UserId, " || ", user.userId);

    if (this.result) {
      return;
    }

    const moveTimeStamp = new Date(Date.now());

    try {
      if (isPromoting(this.board, move.from, move.to)) {
        this.board.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
      } else {
        this.board.move({
          from: move.from,
          to: move.to,
        });
      }
    } catch (error) {
      console.log("Error while making move: ", error);
      return;
    }

    if (this.playerTurn === 1) {
      this.sendPlayer2TimeCount();
      this.playerTurn = 2;
    } else {
      this.sendPlayer1TimeCount();
      this.playerTurn = 1;
    }

    //flipped coz move already made
    if (this.board.turn() === "b") {
      this.player1TimeConsumed +=
        moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    }
    if (this.board.turn() === "w") {
      this.player2TimeConsumed +=
        moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    }

    await this.addMoveToDb(move, moveTimeStamp);
    this.resetAbandonTimer();

    this.lastMoveTime = moveTimeStamp;
    let moveMadeBy =
      this.board.turn() === "b" ? this.player1UserId : this.player2UserId;

    socketManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: MOVE,
        payload: {
          move,
          moveMadeBy,
          player1TimeConsumed: this.player1TimeConsumed,
          player2TimeConsumed: this.player2TimeConsumed,
          currentFen: this.board.fen(),
        },
      })
    );

    if (this.board.isGameOver()) {
      const res = this.board.isDraw()
        ? "DRAW"
        : this.board.turn() === "b"
        ? "WHITE_WINS"
        : "BLACK_WINS";

      this.endGame("COMPLETED", res);
    }
    this.moveCount++;
  }

  sendPlayer1TimeCount() {
    if (Game.intervalId) {
      clearInterval(Game.intervalId);
    }
    if (this.player1TimeCount > 0) {
      Game.intervalId = setInterval(() => {
        this.player1TimeCount = this.player1TimeCount - 1000;
        socketManager.broadcast(
          this.gameId,
          JSON.stringify({
            type: PLAYER_TIME,
            payload: {
              player1TimeCount: this.player1TimeCount,
              player2TimeCount: this.player2TimeCount,
            },
          })
        );
        if (this.player1TimeCount <= 0) {
          this.endGame("TIME_UP", "BLACK_WINS");
          return;
        }
      }, 1000);
    } else {
      if (Game.intervalId) {
        clearInterval(Game.intervalId);
      }
    }
  }

  sendPlayer2TimeCount() {
    if (Game.intervalId) {
      clearInterval(Game.intervalId);
    }
    if (this.player1TimeCount > 0) {
      Game.intervalId = setInterval(() => {
        this.player2TimeCount = this.player2TimeCount - 1000;
        socketManager.broadcast(
          this.gameId,
          JSON.stringify({
            type: PLAYER_TIME,
            payload: {
              player1TimeCount: this.player1TimeCount,
              player2TimeCount: this.player2TimeCount,
            },
          })
        );
        if (this.player2TimeCount <= 0) {
          this.endGame("TIME_UP", "WHITE_WINS");
          return;
        }
      }, 1000);
    } else {
      if (Game.intervalId) {
        clearInterval(Game.intervalId);
      }
    }
  }

  getPlayer1TimeConsumed() {
    if (this.player1TimeConsumed) {
      return (
        this.player1TimeConsumed +
        (new Date(Date.now()).getTime() - this.lastMoveTime.getTime())
      );
    }
    return this.player1TimeConsumed;
  }

  getPlayer2TimeConsumed() {
    if (this.player2TimeConsumed) {
      return (
        this.player2TimeConsumed +
        (new Date(Date.now()).getTime() - this.lastMoveTime.getTime())
      );
    }
    return this.player2TimeConsumed;
  }

  async resetAbandonTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.endGame(
        "ABANDONED",
        this.board.turn() === "b" ? "WHITE_WINS" : "BLACK_WINS"
      );
    }, 60 * 1000);
  }

  exitGame(user: User) {
    this.endGame(
      "PLAYER_EXIT",
      user.userId === this.player1UserId ? "BLACK_WINS" : "WHITE_WINS"
    );
  }

  async endGame(status: GAME_STATUS, result: GAME_RESULT) {
    const updatedGame = await db.game.update({
      data: {
        status,
        result,
      },
      where: {
        id: this.gameId,
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
    socketManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: GAME_ENDED,
        payload: {
          status,
          result,
          moves: updatedGame.moves,
          blackPlayer: {
            id: updatedGame.blackPlayerId,
            username: updatedGame.blackPlayer.username,
          },
          whitePlayer: {
            id: updatedGame.whitePlayerId,
            username: updatedGame.whitePlayer.username,
          },
          currentFen: updatedGame.currentFen,
          game_type: updatedGame.timeControl,
        },
      })
    );

    this.clearTimer();
    this.clearMoveTimer();
    if (Game.intervalId) {
      clearInterval(Game.intervalId);
    }
  }

  setMoveTimer(moveTimer: NodeJS.Timeout) {
    this.moveTimer = moveTimer;
  }

  clearMoveTimer() {
    if (this.timer) clearTimeout(this.timer);
  }

  setTimer(timer: NodeJS.Timeout) {
    this.timer = timer;
  }

  clearTimer() {
    if (this.moveTimer) clearTimeout(this.moveTimer);
  }
}
