"use client";
import { useSocket } from "@/hooks/useSocket";
import GamePage from "@/screens/GamePage";

const page = () => {
  const socket = useSocket();
  return <GamePage />;
};

export default page;
