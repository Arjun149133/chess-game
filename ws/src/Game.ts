import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private moveCount = 0;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    if (this.moveCount % 2 === 0 && socket !== this.player1) {
      console.log("Invalid move1");
      return;
    }
    if (this.moveCount % 2 === 1 && socket !== this.player2) {
      console.log("Invalid move2");
      return;
    }

    try {
      console.log(" move " + move);
      this.board.move(move);
    } catch (error) {
      console.log(error);
      return;
    }

    if (this.moveCount % 2 === 0) {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move,
          },
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move,
          },
        })
      );
    }

    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            move: move,
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            move: move,
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    console.log("Move made");
    this.moveCount++;
  }
}
