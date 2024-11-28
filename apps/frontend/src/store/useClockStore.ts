import { create } from "zustand";

// Define the store for managing clock states
type ClockStore = {
  clock1: {
    time: number; // in seconds
    isRunning: boolean;
  };
  clock2: {
    time: number; // in seconds
    isRunning: boolean;
  };
  startStopClock1: () => void;
  startStopClock2: () => void;
  resetClock1: () => void;
  resetClock2: () => void;
  tickClock1: () => void;
  tickClock2: () => void;
};

export const useClockStore = create<ClockStore>((set) => ({
  clock1: {
    time: 60, // 1 minute
    isRunning: false,
  },
  clock2: {
    time: 60, // 1 minute
    isRunning: false,
  },
  startStopClock1: () =>
    set((state) => ({
      clock1: {
        ...state.clock1,
        isRunning: !state.clock1.isRunning,
      },
    })),
  startStopClock2: () =>
    set((state) => ({
      clock2: {
        ...state.clock2,
        isRunning: !state.clock2.isRunning,
      },
    })),
  resetClock1: () =>
    set((state) => ({
      clock1: {
        ...state.clock1,
        time: 60,
        isRunning: false,
      },
    })),
  resetClock2: () =>
    set((state) => ({
      clock2: {
        ...state.clock2,
        time: 60,
        isRunning: false,
      },
    })),
  tickClock1: () =>
    set((state) => {
      if (state.clock1.isRunning && state.clock1.time > 0) {
        return { clock1: { ...state.clock1, time: state.clock1.time - 1 } };
      }
      return state;
    }),
  tickClock2: () =>
    set((state) => {
      if (state.clock2.isRunning && state.clock2.time > 0) {
        return { clock2: { ...state.clock2, time: state.clock2.time - 1 } };
      }
      return state;
    }),
}));
