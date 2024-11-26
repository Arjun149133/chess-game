import { useUserStrore } from "@/store/userStore";
import { useEffect, useState } from "react";
const WS_URL = "ws://localhost:8080?token=";
export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { token, setToken } = useUserStrore();
  useEffect(() => {
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

    return () => {
      ws.close();
    };
  }, [token, setToken]);

  return socket;
};
