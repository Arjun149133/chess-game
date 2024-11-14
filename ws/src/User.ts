import { WebSocket } from "ws";
import { randomUUID } from "crypto";

export class User {
  public socket: WebSocket;
  public userId: string;
  public id: string;
  public username: string;
  public isGuest?: boolean;

  constructor(
    socket: WebSocket,
    username: string,
    userId: string,
    isGuest: boolean
  ) {
    this.socket = socket;
    this.username = username;
    this.id = randomUUID();
    this.userId = userId;
    this.isGuest = isGuest;
  }
}
