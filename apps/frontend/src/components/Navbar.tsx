"use client";
import Link from "next/link";
import { useUserStrore } from "@/store/userStore";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CustomButton from "./Button";

const URI = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`;

const Navbar = () => {
  const { user } = useUserStrore();
  const setToken = useUserStrore((state) => state.setToken);
  const setUser = useUserStrore((state) => state.setUser);
  const router = useRouter();
  return (
    <div className=" flex justify-between p-3 px-7 border border-slate-900 ">
      <div className=" font-bold text-xl flex justify-center items-center">
        Chess
      </div>
      {user === null ? (
        <div className=" space-x-4 flex">
          <Link href={"/register"}>
            <CustomButton variant="secondary">Register</CustomButton>
          </Link>
          <Link href={"/login"}>
            <CustomButton className=" bg-black hover:bg-gray-900">
              Login
            </CustomButton>
          </Link>
        </div>
      ) : (
        <div className=" flex justify-center items-center space-x-4">
          <div className=" capitalize text-lg">{user.username}</div>
          <div className=" text-sm text-bold">
            <CustomButton
              onClick={async () => {
                try {
                  setToken(null);
                  setUser(null);
                  toast("User logout successfull", {
                    type: "success",
                    position: "bottom-right",
                  });
                  router.push("/");
                  const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
                    {
                      withCredentials: true,
                    }
                  );
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Log Out
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
