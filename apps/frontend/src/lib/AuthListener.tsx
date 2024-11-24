"use client";
import { useUserStrore } from "@/store/userStore";
import { useEffect } from "react";

const AuthListener = () => {
  const { fetchUser } = useUserStrore();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return null;
};

export default AuthListener;
