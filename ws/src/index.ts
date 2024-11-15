import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import url from "url";
import { config } from "dotenv";
import { extractUser } from "./auth";

const wss = new WebSocketServer({ port: 8080 });

config();

const gameManager = new GameManager();

wss.on("connection", function connection(ws, req) {
  //@ts-ignore
  const token: string = url.parse(req.url, true).query.token;
  console.log(token);
  const user = extractUser(token, ws);
  console.log(user);
  if (user !== null) {
    gameManager.addUser(user);
    ws.on("close", () => {
      gameManager.removeUser(user);
    });
  }
});
