"use client";
import { useClockStore } from "@/store/useClockStore";
import { useEffect } from "react";

const Clock = ({ clockId }: { clockId: 1 | 2 }) => {
  // Access state and actions from Zustand store
  const clock = useClockStore((state) =>
    clockId === 1 ? state.clock1 : state.clock2
  );
  const startStopClock = useClockStore((state) =>
    clockId === 1 ? state.startStopClock1 : state.startStopClock2
  );
  const resetClock = useClockStore((state) =>
    clockId === 1 ? state.resetClock1 : state.resetClock2
  );
  const tickClock = useClockStore((state) =>
    clockId === 1 ? state.tickClock1 : state.tickClock2
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (clock.isRunning && clock.time > 0) {
      intervalId = setInterval(() => {
        tickClock(); // Call tick action to decrease time every second
      }, 1000);
    }

    return () => clearInterval(intervalId); // Cleanup interval when component unmounts or clock stops
  }, [clock.isRunning, clock.time, tickClock]);

  const seconds = clock.time % 60;
  const minutes = Math.floor(clock.time / 60);

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return <div className="bg-gray-800 p-2 rounded-lg px-4">{formattedTime}</div>;
};

export default Clock;
