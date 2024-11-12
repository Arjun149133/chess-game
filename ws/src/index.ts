import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
  console.log("hello");
  gameManager.addUser(ws);
  console.log("peter");
  ws.on("close", () => {
    gameManager.removeUser(ws);
    console.log("wtf");
  });
});
