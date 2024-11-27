import { Chess, Move, Square } from "chess.js";
import { GAME_ENDED, GAME_TIME_MS, INIT_GAME, MOVE } from "./message";
import { randomUUID } from "crypto";
import { MoveType } from "./types";
import { User } from "./User";
import { socketManager } from "./SocketManager";
import { db } from "./db";

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

  constructor(
    player1UserId: string,
    player2UserId: string | null,
    gameId?: string,
    startTime?: Date
  ) {
    this.gameId = gameId ?? randomUUID();
    this.player1UserId = player1UserId;
    this.player2UserId = player2UserId;
    this.board = new Chess();
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
    this.resetMoveTimer();
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
          fen: this.board.fen(),
          moves: [],
        },
      })
    );
  }

  async createGameInDb() {
    this.startTime = new Date(Date.now());
    this.lastMoveTime = this.startTime;

    const game = await db.game.create({
      data: {
        id: this.gameId,
        timeControl: "CLASSICAL",
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
            before: move.before,
            after: move.after,
            createdAt: moveTimeStamp,
            timeTaken: moveTimeStamp.getTime() - this.lastMoveTime.getTime(),
            san: move.san,
          },
        }),
        db.game.update({
          data: {
            currentFen: move.after,
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

    if (this.result) {
      console.log("Cannot make move, Game completed.");
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

    //flipped coz move already made
    if (this.board.turn() === "b") {
      this.player1TimeConsumed +=
        moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    }
    if (this.board.turn() === "w") {
      this.player2TimeConsumed +=
        moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    }

    console.log("controle here");

    await this.addMoveToDb(move, moveTimeStamp);
    console.log("control not reached here");
    this.resetAbandonTimer();
    this.resetMoveTimer();

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
    console.log("move made");
    this.moveCount++;
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
    console.log("this was called");
    this.timer = setTimeout(() => {
      console.log("this wasn't");
      this.endGame(
        "ABANDONED",
        this.board.turn() === "b" ? "WHITE_WINS" : "BLACK_WINS"
      );
    }, 10 * 1000); //Change
  }

  async resetMoveTimer() {
    if (this.moveTimer) {
      clearTimeout(this.moveTimer);
    }

    const turn = this.board.turn();
    const timeLeft =
      GAME_TIME_MS -
      (turn === "w" ? this.player1TimeConsumed : this.player2TimeConsumed);

    this.moveTimer = setTimeout(() => {
      this.endGame("TIME_UP", turn === "w" ? "BLACK_WINS" : "WHITE_WINS");
    }, timeLeft);
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
        },
      })
    );

    this.clearTimer();
    this.clearMoveTimer();
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
