import Image from "next/image";
import { Button } from "./ui/button";

const Card = () => {
  return (
    <div className=" h-2/3 bg-dark w-2/3 rounded-lg flex flex-col items-center space-y-4 py-7">
      <PlayButton
        src="https://www.chess.com/bundles/web/images/color-icons/blitz.svg"
        text="Play Online"
        subText="Play with a Person"
      />
      <PlayButton
        src="https://www.chess.com/bundles/web/images/color-icons/handshake.svg"
        text="Play Friend"
        subText="Play with a Friend"
      />
      <PlayButton
        src="https://www.chess.com/bundles/web/images/color-icons/cute-bot.svg"
        text="Play Bots"
        subText="Play with a Bot"
      />
    </div>
  );
};

export default Card;

const PlayButton = ({
  src,
  text,
  subText,
}: {
  src: string;
  text: string;
  subText: string;
}) => {
  return (
    <Button className=" w-fit h-fit md:w-72 md:text-xl grid grid-cols-4 hover:bg-slate-900 text-white px-4">
      <div className=" col-span-1">
        <Image src={src} alt="logo" width={50} height={50} />
      </div>
      <div className=" flex flex-col p-1 m-1 col-span-3 justify-center items-start">
        <div className=" ">{text} </div>
        <span className=" text-sm font-sans">{subText} </span>
      </div>
    </Button>
  );
};
