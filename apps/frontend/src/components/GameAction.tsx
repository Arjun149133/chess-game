"use client";
import Card from "@/components/Card";
import Game from "@/components/Game";
import GameOverDialog from "@/components/GameOverDailog";
import LoginDialog from "@/components/LoginDialog";
import { useSocket } from "@/hooks/useSocket";
import { Game as GameType, useGameStore } from "@/store/gameStore";
import { useUserStrore } from "@/store/userStore";
import { useSocketStore } from "@/store/useSocketStore";
import { Chess, Move } from "chess.js";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useReducer, useRef, useState } from "react";

export const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_ENDED = "game_ended";
const GAME_ADDED = "game_added";
const EXIT_GAME = "exit_game";
const PLAYER_TIME = "player_time";
const JOIN_ROOM = "join_room";
const GAME_JOINED = "game_joined";

const GameAction = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [isGameOver, setIsGameOver] = useState(false);
  const { fetchUser, user } = useUserStrore();
  const { gameId, game } = useGameStore();
  const setGameId = useGameStore((state) => state.setGameId);
  const setGame = useGameStore((state) => state.setGame);
  const params = useParams();
  const gameRef = useRef<GameType | null>(game);

  useEffect(() => {
    fetchUser();
    if (params.gameId) {
      //@ts-ignore
      setGameId(params.gameId);
      // socket?.send(
      //   JSON.stringify({
      //     type: JOIN_ROOM,
      //     payload: {
      //       gameId: gameId,
      //     },
      //   })
      // );
    }
  }, [fetchUser]);

  const handleGameStateSet = (game: GameType) => {
    setGame(game);
    gameRef.current = game;
  };

  const gameOverFunction = () => {
    setIsGameOver(true);
    console.log("function was called");
  };

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const payload = message.payload;
      switch (message.type) {
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
        case PLAYER_TIME:
          console.log("lanj: ", payload);
          if (!gameRef.current) return;
          gameRef.current = {
            ...gameRef.current,
            timer1: payload.player1TimeCount,
            timer2: payload.player2TimeCount,
          };
          setGame(gameRef.current);
          break;
        case GAME_ENDED:
          console.log("game ended", payload);
          if (!gameRef.current) return;
          gameRef.current = {
            ...gameRef.current,
            result: payload.result,
            status: payload.status,
          };
          gameOverFunction();
          console.log(isGameOver);
          console.log("yup game ended", payload);
          break;
        case GAME_JOINED:
          gameRef.current = {
            moveCount: payload.moves.length,
            moves: payload.moves,
            whitePlayer: payload.whitePlayer,
            blackPlayer: payload.blackPlayer,
            timer1: 60 * 1000 - payload.player1TimeConsumed,
            timer2: 60 * 1000 - payload.player2TimeConsumed,
          };
          setGame(gameRef.current);
          console.log(game);
          break;
      }
    };
  }, [socket, chess, board]);

  if (!socket) {
    return <div>connecting...</div>;
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
            socket.send(
              JSON.stringify({
                type: INIT_GAME,
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

export default GameAction;
