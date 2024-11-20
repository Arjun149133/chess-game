import { Chess, Color, PieceSymbol, Square } from "chess.js";
import Image from "next/image";
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

      try {
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
      } catch (error) {
        console.log(error);
        setFrom(null);
        setTo(null);
      }
    }
  };

  function fill(type: string, color: string): string {
    switch (type) {
      case "p":
        if (color === "w") {
          return "/white-pawn.svg";
        } else {
          return "/pawn.svg";
        }
      case "k":
        if (color === "w") {
          return "/white-king.svg";
        } else {
          return "/king.svg";
        }
      case "q":
        if (color === "w") {
          return "/white-queen.svg";
        } else {
          return "/queen.svg";
        }
      case "r":
        if (color === "w") {
          return "/white-rook.svg";
        } else {
          return "/rook.svg";
        }
      case "n":
        if (color === "w") {
          return "/white-knight.svg";
        } else {
          return "/knight.svg";
        }
      case "b":
        if (color === "w") {
          return "/white-bishop.svg";
        } else {
          return "/bishop.svg";
        }
    }

    return "/pawn.svg";
  }

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
                  className={`text-xl flex justify-center items-center ${
                    square.color === "w" ? "text-white" : "text-black"
                  }`}
                >
                  {fill(square.type, square.color) !== null ? (
                    <Image
                      src={fill(square.type, square.color)}
                      alt={square.type}
                      width={48}
                      height={48}
                    />
                  ) : (
                    square.type
                  )}
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