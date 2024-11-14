import jwt from "jsonwebtoken";
import { User } from "../User";
import { WebSocket } from "ws";

const secret = process.env.JWT_SECRET!;

export interface jwtClaims {
  username: string;
  userId: string;
  isGuest: boolean;
}

export const extractUser = (token: string, ws: WebSocket): User | null => {
  try {
    const { username, userId, isGuest } = jwt.verify(
      token,
      "a20GkWEtQnnvWk16waEj0VFo4hEWroSF"
    ) as jwtClaims;

    return new User(ws, username, userId, isGuest);
  } catch (error) {
    console.log("error: ", error);

    return null;
  }
};
