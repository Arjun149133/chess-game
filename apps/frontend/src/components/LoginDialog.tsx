import Link from "next/link";
import CustomButton from "./Button";
import { Button } from "./ui/button";
import axios from "axios";
import { useUserStrore } from "@/store/userStore";
import { toast } from "react-toastify";

const LoginDialog = () => {
  const { user } = useUserStrore();
  const setToken = useUserStrore((state) => state.setToken);
  const setUser = useUserStrore((state) => state.setUser);

  const handleOnGuestLogin = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/guest`,
        void 0,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setToken(res.data.token);
      setUser({
        ...res.data.user,
        isGuest: true,
      });
      toast("Logged in as a guest", {
        type: "success",
        position: "bottom-right",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        className=" h-screen w-screen absolute bg-dark opacity-80"
        onClick={handleOnGuestLogin}
      ></div>
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-fit md:w-72 min-w-fit rounded-lg p-8 bg-dark">
        <div className=" flex flex-col gap-4">
          <Link href={"/register"}>
            <CustomButton variant="secondary" className=" py-6">
              Register
            </CustomButton>
          </Link>
          <Link href={"/login"}>
            <CustomButton className=" py-6">Login</CustomButton>
          </Link>
          <Button
            variant="ghost"
            className=" hover:bg-transparent hover:text-slate-300 md:text-lg"
            onClick={handleOnGuestLogin}
          >
            Play as a Guest
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginDialog;
