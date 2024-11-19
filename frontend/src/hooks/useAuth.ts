import { useUserStrore } from "@/store/userStore";
import { useEffect } from "react";

const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`;

export const useAuth = () => {
  const { user } = useUserStrore();
  const setToken = useUserStrore((state) => state.setToken);
  const setUser = useUserStrore((state) => state.setUser);
  useEffect(() => {
    async function f() {
      try {
        const res = await fetch(URL, {
          method: "GET",
          credentials: "include",
        });
        if (res.statusText === "OK") {
          const data = await res.json();
          console.log("tokennn ", data.token);
          setToken(data.token);
          if (user.username === "") {
            console.log(data);
            setUser({
              username: data.username,
              id: data.id,
              email: data.email,
              picture: data.picture || null,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    f();
  }, [setToken, setUser]);
};
