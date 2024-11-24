import axios from "axios";
import { create } from "zustand";

interface User {
  username: string;
  id: string;
  email: string;
  picture?: string;
  isGuest?: boolean;
}

interface UserState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

export const useUserStrore = create<UserState>((set) => ({
  token: null,
  user: null,

  setToken: (token) => set(() => ({ token })),
  setUser: (user) => set(() => ({ user })),
  fetchUser: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
        {
          withCredentials: true,
        }
      );
      if (res.statusText === "OK") {
        const data = res.data;
        set(() => ({ token: data.token }));
        set(() => ({
          user: {
            username: data.username,
            id: data.id,
            email: data.email,
            picture: data.picture || null,
            isGuest: data.isGuest,
          },
        }));
      }
    } catch (e) {
      console.log("error fetching the user", e);
    }
  },

  clearUser: () => set(() => ({ token: null, user: null })),
}));
