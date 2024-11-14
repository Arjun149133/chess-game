import { INIT_GAME } from "@/screens/GamePage";
import Board from "./Board";
import Button from "./Button";
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
    <div className=" grid grid-cols-9">
      <div className="col-span-1"></div>
      <div className=" col-span-4 flex justify-center items-center h-screen">
        <Board
          board={board}
          socket={socket}
          chess={chess}
          setBoard={setBoard}
        />
      </div>
      <div className=" col-span-4">
        <Button
          variant="dark"
          styles="w-52 mt-24"
          onclick={() => {
            socket.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            );
          }}
        >
          Play
        </Button>
      </div>
    </div>
  );
};

export default Game;
