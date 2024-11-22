"use client";
import Link from "next/link";
import Button from "./Button";
import { useUserStrore } from "@/store/userStore";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const URI = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`;

const Navbar = () => {
  const { user } = useUserStrore();
  const setToken = useUserStrore((state) => state.setToken);
  const setUser = useUserStrore((state) => state.setUser);
  const router = useRouter();
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
        <div className=" flex justify-center items-center space-x-4">
          <div className=" capitalize text-lg">{user.username}</div>
          <div className=" text-sm text-bold">
            <Button
              onclick={async () => {
                try {
                  setToken("");
                  setUser({
                    username: "",
                    id: "",
                    email: "",
                    picture: undefined,
                  });
                  const res = await axios.get(URI, { withCredentials: true });
                  toast("User logout successfull", {
                    type: "success",
                    position: "bottom-right",
                  });
                  router.push("/");
                } catch (error) {
                  console.log(error);
                }
              }}
              styles=""
            >
              Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
