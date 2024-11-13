import { Color, PieceSymbol, Square } from "chess.js";

const Board = ({
  board,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
}) => {
  return (
    <div className="">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <div
              key={j}
              className={`w-8 h-8 ${
                (i + j) % 2 === 0 ? "bg-green-300" : "bg-green-500"
              }`}
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
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
