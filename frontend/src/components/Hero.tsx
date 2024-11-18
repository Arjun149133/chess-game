"use client";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
import { useUserStrore } from "@/store/userStore";

const Hero = () => {
  const { token, user } = useUserStrore();
  return (
    <div className=" flex justify-center items-center max-h-full space-x-10 p-4 mt-10">
      <div>
        <Link href={"/play/online"}>
          <Image
            src="https://www.chess.com/bundles/web/images/offline-play/standardboard.1d6f9426.png"
            width={400}
            height={400}
            alt="ChessBoard"
            className=" cursor-pointer"
          />
        </Link>
      </div>
      <div className=" flex flex-col space-y-7">
        <div className=" text-3xl font-bold">
          Play Chess Online <br />{" "}
          <span className=" flex justify-center">on the #3 Site!</span>
        </div>
        <div className="flex justify-center">
          <Link href={"/play/online"}>
            <Button variant="dark" styles="bg-green-600 h-12 w-48 font-bold">
              Play Online
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
