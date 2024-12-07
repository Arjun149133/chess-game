import { useUserStrore } from "@/store/userStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useEffect, useState } from "react";
const WS_URL = "ws://localhost:8080?token=";
export const useSocket = () => {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const { token, setToken } = useUserStrore();
  useEffect(() => {
    if (socket) return;
    if (!token) return;
    const ws = new WebSocket(`${WS_URL}${token}`);
    console.log("how many times");

    ws.onopen = () => {
      setSocket(ws);
      console.log("socket opened");
    };

    ws.onclose = () => {
      setSocket(null);
      console.log("socket closed");
    };

    // return () => {
    //   console.log("calling close from use");
    //   ws.close();
    // };
  }, [token, setToken]);

  return socket;
};
