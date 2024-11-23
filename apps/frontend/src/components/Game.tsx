import { INIT_GAME } from "@/screens/GamePage";
import Board from "./Board";
import Button from "./Button";
import { Chess } from "chess.js";
import { ProfileCard } from "@/app/play/page";

const Game = ({
  socket,
  board,
  chess,
  setBoard,
}: {
  socket: WebSocket;
  board: any;
  chess: Chess;
  setBoard: any;
}) => {
  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <Board board={board} socket={socket} chess={chess} setBoard={setBoard} />
    </div>
  );
};

export default Game;
