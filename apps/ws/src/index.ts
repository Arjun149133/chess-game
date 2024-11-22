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
  const user = extractUser(token, ws);

  if (!user) {
    console.error("user not authenticated");
    return;
  }

  gameManager.addUser(user);
  console.log("user: ", user.userId);

  ws.on("close", () => {
    console.log("for the user: ", user.userId);
    gameManager.removeUser(ws);
  });
});
