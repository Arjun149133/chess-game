import { Chess, Square } from "chess.js";

export function isPromoting(chess: Chess, from: Square, to: Square) {
  if (!from) return false;

  const piece = chess.get(from);

  // Ensure the piece is a pawn and it's the correct player's turn
  if (piece.type !== "p") return false;
  if (piece.color !== chess.turn()) return false;

  // Ensure the destination square is in the promotion rank (1st or 8th)
  const promotionRank = piece.color === "w" ? "8" : "1"; // White promotes to 8th rank, Black to 1st rank
  if (!to.endsWith(promotionRank)) return false;

  // Check if the move is valid and is a promotion move
  const validMoves = chess.moves({ square: from, verbose: true });
  return validMoves.some((move) => move.to === to && move.promotion);
}
