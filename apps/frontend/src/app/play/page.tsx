import Card from "@/components/Card";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

const PlayPage = () => {
  return (
    <div className=" grid grid-cols-12 max-h-screen">
      <div className=" col-span-2">
        <Sidebar />
      </div>
      <div className=" col-span-5">
        <div className=" flex flex-col items-center justify-center h-full ">
          <div>
            <ProfileCard
              src="https://www.chess.com/bundles/web/images/black_400.png"
              name="opponent"
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
              name="arjun"
            />
          </div>
          <div></div>
        </div>
      </div>
      <div className=" col-span-5 flex items-center">
        <Card card1={true} />
      </div>
    </div>
  );
};

export const ProfileCard = ({ src, name }: { src: string; name: string }) => {
  return (
    <div className=" flex space-x-3 w-full py-4">
      <div>
        <Image
          src={src}
          width={50}
          height={50}
          alt="opponent"
          className=" cursor-pointer"
        />
      </div>
      <div>
        <div className=" text-white ">{name}</div>
      </div>
    </div>
  );
};

export default PlayPage;
