"use client";
import Board from "@/components/Board";
import Button from "@/components/Button";
import { useSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

const INIT_GAME = "init_game";
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
          setChess(new Chess());
          setBoard(chess.board());
          console.log("Game initialized");
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Loading...</div>;

  return (
    <div className=" grid grid-cols-9 h-screen">
      <div className=" col-span-2"></div>
      <div className=" col-span-4 h-full">
        <div>
          <Board board={board} />
        </div>
      </div>
      <div className=" col-span-3 pt-20">
        <Button
          text="Play"
          variant="dark"
          styles=" w-72 h-12 font-bold"
          onclick={() => {
            socket.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            );
          }}
        />
      </div>
    </div>
  );
};

export default GamePage;
