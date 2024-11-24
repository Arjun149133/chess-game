import Board from "./Board";
import { Chess } from "chess.js";
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
