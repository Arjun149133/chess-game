import { create } from "zustand";

interface Socket {
  socket: WebSocket | null;
  setSocket: (socket: WebSocket | null) => void;
}

export const useSocketStore = create<Socket>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
