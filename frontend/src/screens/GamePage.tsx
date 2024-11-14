"use client";
import Board from "@/components/Board";
import Button from "@/components/Button";
import Game from "@/components/Game";
import { useSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

export const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";

const GamePage = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          console.log("Game initialized " + message.payload.color);
          break;
        case MOVE:
          const move = message.payload.move;
          console.log(move);
          chess.move({
            from: move.from,
            to: move.to,
          });
          console.log("Move made" + move);
          setBoard(chess.board());
          console.log("Move made1" + move);
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
      }
    };
  }, [socket, chess, board]);

  if (!socket) return <div>Loading...</div>;

  return (
    <Game socket={socket} board={board} setBoard={setBoard} chess={chess} />
  );
};

export default GamePage;
