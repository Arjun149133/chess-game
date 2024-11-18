import { create } from "zustand";

interface User {
  username: string;
  id: string;
  email: string;
  picture?: string;
}

interface UserState {
  token: string;
  user: User;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStrore = create<UserState>((set) => ({
  token: "",
  user: { username: "", id: "", email: "" },

  setToken: (token) => set(() => ({ token })),
  setUser: (user) => set(() => ({ user })),

  clearUser: () =>
    set(() => ({ token: "", user: { username: "", id: "", email: "" } })),
}));
