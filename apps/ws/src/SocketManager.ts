import { Game } from "./Game";
import { User } from "./User";

export class SocketManager {
  private static instance: SocketManager;
  private interestedSockets: Map<string, User[]>;
  private userRoomMapping: Map<string, string>;

  constructor() {
    this.interestedSockets = new Map<string, User[]>();
    this.userRoomMapping = new Map<string, string>();
  }

  static getInstance() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }

    SocketManager.instance = new SocketManager();
    return SocketManager.instance;
  }

  addUser(user: User, roomId: string) {
    this.interestedSockets.set(roomId, [
      ...(this.interestedSockets.get(roomId) || []),
      user,
    ]);
    this.userRoomMapping.set(user.userId, roomId);
    console.log("userRoomMapping: ", this.userRoomMapping);
  }

  broadcast(roomId: string, message: string) {
    const users = this.interestedSockets.get(roomId);
    if (!users) {
      if (Game.intervalId) {
        clearInterval(Game.intervalId);
      }
      console.log("No users in the room");
      return;
    }
    users.forEach((user) => {
      user.socket.send(message);
    });
  }

  removeUser(user: User) {
    console.log("why here?");
    console.log("2time: ", this.userRoomMapping);
    const roomId = this.userRoomMapping.get(user.userId);
    if (!roomId) {
      console.log("User was not interested in any room");
      return;
    }
    const room = this.interestedSockets.get(roomId) || [];
    const remainingUsers = room.filter((u) => u.userId !== user.userId);
    console.log("deleting this user: ", user.userId);

    this.interestedSockets.set(roomId, remainingUsers);

    if (this.interestedSockets.get(roomId)?.length === 0) {
      this.interestedSockets.delete(roomId);
    }
    this.userRoomMapping.delete(user.userId);
  }
}

export const socketManager = SocketManager.getInstance();
