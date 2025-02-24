"use client";
import { Game, useGameStore } from "@/store/gameStore";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import Image from "next/image";
import { useState } from "react";
import { ProfileCard } from "./ProfileCard";
import Clock from "./Clock";
import { useUserStrore } from "@/store/userStore";
import { isPromoting } from "@/utils/isPromoting";

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
  gameRef?: Game | null;
}) => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const { gameId, game } = useGameStore();
  const { user } = useUserStrore();

  const handleSquareClick = (
    square: { square: string; color: Color; type: PieceSymbol } | null,
    i: number,
    j: number
  ) => {
    const squareId = `${String.fromCharCode(97 + j)}${8 - i}`; // Compute the square ID (like "e4")

    if (from === null) {
      setFrom(squareId);
    } else {
      setTo(squareId);

      try {
        if (
          (chess.turn() === "w" && user?.id !== game?.whitePlayer?.id) ||
          (chess.turn() === "b" && user?.id !== game?.blackPlayer?.id)
        ) {
          throw Error("you cannot make other players move");
        }

        if (isPromoting(chess, from as Square, squareId as Square)) {
          socket.send(
            JSON.stringify({
              type: "move",
              payload: {
                gameId: gameId,
                move: {
                  from,
                  to: squareId,
                  promotion: "q",
                },
              },
            })
          );
          chess.move({
            from,
            to: squareId,
            promotion: "q",
          });
        } else {
          socket.send(
            JSON.stringify({
              type: "move",
              payload: {
                gameId: gameId,
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
        }

        setBoard(chess.board());

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

  if (gameId && !game) {
    return <div>Waiting for Player2...</div>;
  }

  return (
    <div className=" flex flex-col items-center justify-center overflow-hidden">
      <div className=" w-full flex justify-between">
        <div>
          <ProfileCard
            src="https://www.chess.com/bundles/web/images/black_400.png"
            username={game?.blackPlayer?.username}
          />
        </div>
        <div className=" flex items-center lg:text-lg">
          <Clock time={game?.timer2} />
        </div>
      </div>
      <div className=" hover:cursor-pointer">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((square, j) => (
              <button
                key={j}
                className={`w-[68px] h-[68px] ${
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
                        className=" rotate-180 "
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
      <div className=" w-full flex justify-between">
        <div>
          <ProfileCard
            src="https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif"
            username={game?.whitePlayer?.username}
          />
        </div>
        <div className=" flex items-center lg:text-lg">
          <Clock time={game?.timer1} />
        </div>
      </div>
    </div>
  );
};

export default Board;
