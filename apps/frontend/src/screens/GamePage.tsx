"use client";
import Card from "@/components/Card";
import Game from "@/components/Game";
import LoginDialog from "@/components/LoginDialog";
import { useSocket } from "@/hooks/useSocket";
import { Game as GameType, useGameStore } from "@/store/gameStore";
import { useUserStrore } from "@/store/userStore";
import { Chess, Move } from "chess.js";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

export const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_ENDED = "game_ended";
const GAME_ADDED = "game_added";

const GamePage = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const { fetchUser, user } = useUserStrore();
  const { gameId, game } = useGameStore();
  const setGameId = useGameStore((state) => state.setGameId);
  const setGame = useGameStore((state) => state.setGame);
  const router = useRouter();
  const params = useParams();

  const gameRef = useRef<GameType | null>(null);

  useEffect(() => {
    fetchUser();
    if (params.gameId) {
      //@ts-ignore
      setGameId(params.gameId);
      console.log(params.gameId);
    }
  }, [fetchUser]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const payload = message.payload;
      switch (message.type) {
        case GAME_ADDED:
          setGameId(payload.gameId);
          // router.push(`/play/online/game/${message.payload.gameId}`);
          console.log("payloadid: ", message.payload.gameId);
          console.log("game_added ", message);
          break;
        case INIT_GAME:
          setGameId(payload.gameId);
          const newGame: GameType = {
            moveCount: 0,
            whitePlayer: payload.whitePlayer.username,
            blackPlayer: payload.blackPlayer.username,
            fen: payload.fen,
            moves: [],
          };
          setGame(newGame);
          gameRef.current = newGame; // Store in ref
          setBoard(chess.board());
          console.log("Game Initialized: ", message);
          break;
        case MOVE:
          if (!gameRef.current) return;
          console.log(message);
          const move = message.payload.move as Move;
          console.log(move);
          if (message.payload.moveMadeBy !== user?.id) {
            chess.move(move);
            console.log("Move made" + move);
            setBoard(chess.board());
            console.log("Move made1" + move);
          }
          gameRef.current = {
            ...gameRef.current,
            moveCount: gameRef.current.moveCount + 1,
            moves: [...(gameRef.current.moves || []), move],
          };

          setGame(gameRef.current);
          console.log("Move made: ", game);
          console.log("Move maderef: ", gameRef.current);
          break;
        case GAME_ENDED:
          console.log("Game over: ", message);
          break;
      }
    };
  }, [socket, chess, board]);

  if (!socket) {
    return <LoginDialog />;
  }

  return (
    <>
      <div className=" col-span-5">
        <Suspense fallback={<div>Loading...</div>}>
          <Game
            socket={socket}
            board={board}
            setBoard={setBoard}
            chess={chess}
          />
        </Suspense>
      </div>
      <div className=" col-span-5 flex items-center">
        <Card
          card1={false}
          gameId={gameId}
          onPlayButtonClick={() => {
            socket.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            );
          }}
          moves={gameRef.current?.moves}
        />
      </div>
    </>
  );
};

export default GamePage;
