import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

const Board = ({
  chess,
  setBoard,
  board,
  socket,
}: {
  chess: Chess;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const handleSquareClick = (
    square: { square: string; color: Color; type: PieceSymbol } | null,
    i: number,
    j: number
  ) => {
    const squareId = `${String.fromCharCode(97 + j)}${8 - i}`; // Compute the square ID (like "e4")

    if (from === null) {
      setFrom(squareId);
      console.log("First click: from square set to", squareId);
    } else {
      setTo(squareId);
      console.log("Second click: to square set to", squareId);

      socket.send(
        JSON.stringify({
          type: "move",
          payload: {
            move: {
              from,
              to: squareId,
            },
          },
        })
      );
      chess.move({
        from,
        to: squareId,
      });
      setBoard(chess.board());
      console.log("Move sent:", from, squareId);
      setFrom(null);
      setTo(null);
    }
  };

  return (
    <div className=" hover:cursor-pointer">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <button
              key={j}
              className={`w-16 h-16 ${
                (i + j) % 2 === 0 ? "bg-green-300" : "bg-green-500"
              }`}
              onClick={() => handleSquareClick(square, i, j)}
            >
              {square ? (
                <div
                  className={`text-xl ${
                    square.color === "w" ? "text-white" : "text-black"
                  }`}
                >
                  {square.type}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
