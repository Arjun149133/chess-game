import { useUserStrore } from "@/store/userStore";
import { useEffect } from "react";

const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`;

export const useAuth = () => {
  const { user, setUser, setToken } = useUserStrore();
  useEffect(() => {
    async function f() {
      const res = await fetch(URL, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      setToken(data.token);
      if (user.username === "") {
        setUser({
          username: data.username,
          id: data.id,
          email: data.email,
          picture: data.picture || null,
        });
      }
    }
    console.log("hello");
    f();
    console.log("world");
  }, [setToken, setUser]);

  return;
};
