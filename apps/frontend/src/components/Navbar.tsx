"use client";
import Link from "next/link";
import Button from "./Button";
import { useUserStrore } from "@/store/userStore";

const Navbar = () => {
  const { user } = useUserStrore();
  return (
    <div className=" flex justify-between p-3 px-7 border border-slate-900">
      <div className=" font-bold text-xl flex justify-center items-center">
        Chess
      </div>
      {user.username === "" ? (
        <div className=" space-x-4 flex">
          <Link href={"/register"}>
            <Button styles=" w-28" variant="dark">
              Sign In
            </Button>
          </Link>
          <Link href={"/login"}>
            <Button styles=" w-28">Log In</Button>
          </Link>
        </div>
      ) : (
        <div>{user.username}</div>
      )}
    </div>
  );
};

export default Navbar;
