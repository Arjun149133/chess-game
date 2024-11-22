"use client";
import Game from "@/components/Game";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useGameStore } from "@/store/gameStore";
import { useUserStrore } from "@/store/userStore";
import { Chess } from "chess.js";
import Link from "next/link";
import { useEffect, useState } from "react";

export const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_ENDED = "game_ended";
const GAME_ADDED = "game_added";

const GamePage = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const setGameId = useGameStore((state) => state.setGameId);
  const { user } = useUserStrore();

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case GAME_ADDED:
          setGameId(message.payload.gameId);
          console.log("payloadid: ", message.payload.gameId);
          console.log("game_added ", message);
          break;
        case INIT_GAME:
          setGameId(message.payload.gameId);
          setBoard(chess.board());
          console.log("Gamie: ", message);
          break;
        case MOVE:
          console.log(message);
          const move = message.payload.move;
          console.log(move);
          if (message.payload.moveMadeBy !== user.id) {
            chess.move(move);
            console.log("Move made" + move);
            setBoard(chess.board());
            console.log("Move made1" + move);
          }
          break;
        case GAME_ENDED:
          console.log("Game over: ", message);
          break;
      }
    };
  }, [socket, chess, board]);

  if (!socket)
    return (
      <div>
        <div>
          <Link href={"/"}>back</Link>
        </div>
        Loading...
      </div>
    );

  return (
    <div>
      <Game socket={socket} board={board} setBoard={setBoard} chess={chess} />
    </div>
  );
};

export default GamePage;
