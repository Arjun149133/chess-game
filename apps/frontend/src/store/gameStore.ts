import { GAME_RESULT, GAME_STATUS } from "@/utils/utils";
import { Move } from "chess.js";
import { create } from "zustand";

export interface Player {
  username: string;
  id: string;
  isGuest: boolean;
}

export interface Game {
  moveCount: number;
  whitePlayer?: Player;
  blackPlayer?: Player;
  player1TimeConsumed?: number;
  player2TimeConsumed?: number;
  fen?: string;
  moves?: Move[];
  status?: GAME_STATUS;
  result?: GAME_RESULT;
  timer1?: number;
  timer2?: number;
}

export interface Payload {
  gameId: string | null;
  game: Game | null;
  setGameId: (gameId: string) => void;
  setGame: (game: Game) => void;
}

export const useGameStore = create<Payload>((set) => ({
  gameId: null,
  game: null,
  setGameId: (gameId) => set(() => ({ gameId })),
  setGame: (game) => set(() => ({ game })),
}));
