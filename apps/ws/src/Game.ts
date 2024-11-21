import { Chess, Move, Square } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, GAME_TIME_MS, INIT_GAME, MOVE } from "./message";
import { randomUUID } from "crypto";
import { MoveType } from "./types";
import { User } from "./User";

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

  if (piece.type !== "p") return false;
  if (piece.color !== chess.turn()) return false;

  if (!["1", "8"].some((ele) => to.endsWith(ele))) return false;

  return chess
    .moves({ square: from, verbose: true })
    .some((move) => move.to === to);
}

export class Game {
  public gameId: string;
  public player1UserId: string;
  public player2UserId: string | null;
  public board: Chess;
  private moveCount = 0;
  private timer: NodeJS.Timeout | null = null;
  private moveTimer: NodeJS.Timeout | null = null;
  private result: GAME_RESULT | null = null;
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
  }

  makeMove(user: User, move: Move) {
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

    if (this.board.turn() === "b") {
      this.player1TimeConsumed +=
        moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    }
    if (this.board.turn() === "w") {
      this.player2TimeConsumed +=
        moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    }

    //TODO: add move to db
    this.resetAbandonTimer();
    this.resetMoveTimer();

    this.lastMoveTime = moveTimeStamp;

    //TODO: broadcast to users

    if (this.board.isGameOver()) {
      const res = this.board.isDraw()
        ? "DRAW"
        : this.board.turn() === "b"
        ? "WHITE_WINS"
        : "BLACK_WINS";

      // this.endGame(): TODO: broadcast to users with update on db
    }

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

    this.timer = setTimeout(() => {
      this.endGame(
        "ABANDONED",
        this.board.turn() === "b" ? "WHITE_WINS" : "BLACK_WINS"
      );
    }, 60 * 1000);
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

  endGame(status: GAME_STATUS, result: GAME_RESULT) {
    //update game on db: TODO
    //broadcast to users: TODO

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
