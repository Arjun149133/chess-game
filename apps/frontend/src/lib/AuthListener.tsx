"use client";

import { useAuth } from "@/hooks/useAuth";

const AuthListener = () => {
  useAuth();
  return null;
};

export default AuthListener;
