import { create } from "zustand";

interface payload {
  gameId: string;
  moveCount: number;
  whitePlayerId?: string;
  blackPlayerId?: string;
  fen?: string;
  moves?: string[];
  setGameId: (gameId: string) => void;
}

export const useGameStore = create<payload>((set) => ({
  gameId: "",
  moveCount: 0,
  setGameId: (gameId) => set(() => ({ gameId })),
}));
