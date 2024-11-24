"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Logout } from "@/icons/Logout";
import Image from "next/image";
import { useUserStrore } from "@/store/userStore";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const { user, token } = useUserStrore();
  const setToken = useUserStrore((state) => state.setToken);
  const setUser = useUserStrore((state) => state.setUser);
  const router = useRouter();
  return (
    <div className=" bg-dark flex flex-col items-center h-screen">
      <div className=" m-2 p-2">
        <h1 className=" text-white text-2xl font-bold p-4">Chess</h1>
      </div>
      {token ? (
        <div className=" flex flex-1 items-end py-4 w-full justify-center">
          <div className=" flex justify-center items-center w-full gap-4 border-t border-gray-500 py-4">
            <div
              className=" w-8 h-8 cursor-pointer"
              onClick={async () => {
                try {
                  const res = await axios.get("/api/logout");
                  setToken("");
                  setUser({
                    username: "",
                    id: "",
                    email: "",
                    picture: undefined,
                  });
                  toast("User logout successfull", {
                    type: "success",
                    position: "bottom-right",
                  });
                  router.push("/");
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <Logout />
            </div>
            <div>
              <Profile username={user?.username} />
            </div>
          </div>
        </div>
      ) : (
        <div className=" flex flex-col space-y-4">
          <Link href={"/login"}>
            <Button className="bg-green-800 hover:bg-green-700 w-full">
              Login
            </Button>
          </Link>
          <Link href={"/register"}>
            <Button className=" bg-white hover:bg-green-100 text-black w-full">
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

const Profile = ({
  username,
  picture = "https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif",
}: {
  username?: string;
  picture?: string;
}) => {
  if (!username) return null;
  if (username.length > 15) {
    username = username.slice(0, 10) + "...";
  }
  return (
    <div className=" flex justify-center items-center md:text-lg gap-2 w-full ">
      {username}
      <Image
        src={picture}
        alt="img"
        width={25}
        height={25}
        className=" rounded-full object-cover h-8 w-8"
      />
    </div>
  );
};
