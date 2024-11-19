import { useUserStrore } from "@/store/userStore";
import { useEffect, useState } from "react";
const WS_URL = "ws://localhost:8080?token=";
export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { token } = useUserStrore();

  useEffect(() => {
    console.log("first control");
    if (!token) return;
    console.log("control reached here");
    const ws = new WebSocket(`${WS_URL}${token}`);
    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};
