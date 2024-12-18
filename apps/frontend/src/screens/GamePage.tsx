"use client";
import Card from "@/components/Card";
import Game from "@/components/Game";
import GameOverDialog from "@/components/GameOverDailog";
import LoginDialog from "@/components/LoginDialog";
import { Game as GameType, useGameStore } from "@/store/gameStore";
import { useSocketStore } from "@/store/useSocketStore";
import { Chess, Move } from "chess.js";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

export const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_ENDED = "game_ended";
const GAME_ADDED = "game_added";
const EXIT_GAME = "exit_game";
const PLAYER_TIME = "player_time";
export enum GAME_TYPE {
  CLASSICAL,
  BLITZ,
  RAPID,
  BULLET,
}

const GamePage = () => {
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [isGameOver, setIsGameOver] = useState(false);
  const { gameId, game } = useGameStore();
  const setGameId = useGameStore((state) => state.setGameId);
  const setGame = useGameStore((state) => state.setGame);
  const router = useRouter();
  const gameRef = useRef<GameType | null>(null);

  const handleGameStateSet = (game: GameType) => {
    setGame(game);
    gameRef.current = game;
  };

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const payload = message.payload;
      switch (message.type) {
        case GAME_ADDED:
          setGameId(payload.gameId);
          console.log("payloadid: ", message.payload.gameId);
          console.log("game_added ", message);
          break;
        case INIT_GAME:
          setGameId(payload.gameId);
          const newGame: GameType = {
            moveCount: 0,
            game_type: payload.game_type,
            whitePlayer: {
              username: payload.whitePlayer.username,
              id: payload.whitePlayer.id,
              isGuest: payload.whitePlayer.isGuest,
            },
            blackPlayer: {
              username: payload.blackPlayer.username,
              id: payload.blackPlayer.id,
              isGuest: payload.blackPlayer.isGuest,
            },
            fen: payload.fen,
            moves: [],
          };
          handleGameStateSet(newGame);
          setBoard(chess.board());
          router.push(`/play/online/game/${message.payload.gameId}`);
          console.log("Game Initialized: ", message);
          break;
      }
    };
  }, [socket, chess, board]);

  if (!socket) {
    return <LoginDialog />;
  }

  if (isGameOver) {
    if (!gameRef.current?.status || !gameRef.current.result) return null;
    return (
      <GameOverDialog
        status={gameRef.current?.status}
        result={gameRef.current?.result}
        setIsGameOver={setIsGameOver}
      />
    );
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
            console.log("clicked play: ", game?.game_type);
            socket.send(
              JSON.stringify({
                type: INIT_GAME,
                payload: {
                  game_type: game?.game_type,
                },
              })
            );
          }}
          onResignButtonClick={() => {
            socket.send(
              JSON.stringify({
                type: EXIT_GAME,
                payload: {
                  gameId: gameId,
                },
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
