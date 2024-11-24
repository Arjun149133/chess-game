import Card from "@/components/Card";
import { ProfileCard } from "@/components/ProfileCard";
import Image from "next/image";

const PlayPage = () => {
  return (
    <>
      <div className=" col-span-5">
        <div className=" flex flex-col items-center justify-center h-full ">
          <div>
            <ProfileCard
              src="https://www.chess.com/bundles/web/images/black_400.png"
              username="opponent"
            />
            <Image
              src="https://www.chess.com/bundles/web/images/offline-play/standardboard.1d6f9426.png"
              width={500}
              height={500}
              alt="ChessBoard"
              className=" cursor-pointer"
            />
            <ProfileCard
              src="https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif"
              username="arjun"
            />
          </div>
          <div></div>
        </div>
      </div>
      <div className=" col-span-5 flex items-center">
        <Card card1={true} />
      </div>
    </>
  );
};

export default PlayPage;
