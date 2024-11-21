import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./message";
import { Game } from "./Game";
import { User } from "./User";

export class GameManager {
  private games: Game[];
  private users: User[];
  private pendingUser: WebSocket | null;

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user.socket);
  }

  removeUser(user: User) {
    this.users = this.users.filter((u) => u.socket !== user.socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }

      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        console.log("moving " + message.payload.move);
        if (game) {
          console.log("Move made" + message.payload.move);
          game.makeMove(socket, message.payload.move);
        }
      }
    });
  }
}
