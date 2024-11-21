import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import url from "url";
import { extractUser } from "./auth";
import "dotenv/config";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws, req) {
  //@ts-ignore
  const token: string = url.parse(req.url, true).query.token;
  console.log(token);
  const user = extractUser(token, ws);
  console.log(user?.isGuest);
  if (user !== null) {
    gameManager.addUser(user);
    console.log("controll ");
    ws.on("close", () => {
      gameManager.removeUser(user);
    });
  }
});
