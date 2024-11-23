import Image from "next/image";
import { Button } from "./ui/button";
import DropDownButton from "./DropDownButton";

const Card = ({
  card1,
  onPlayButtonClick,
}: {
  card1: boolean;
  onPlayButtonClick?: () => void;
}) => {
  return (
    <div className=" h-3/4 bg-dark w-2/3 rounded-lg flex flex-col items-center space-y-4 py-7">
      {card1 ? (
        <>
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
        </>
      ) : (
        <div className=" flex flex-col space-y-4">
          <DropDownButton />
          <Button
            onClick={onPlayButtonClick}
            className=" w-72 h-16 md:text-xl bg-green-800 hover:bg-green-700 font-bold shadow-lg border-green-950 "
          >
            Play
          </Button>
        </div>
      )}
    </div>
  );
};

export default Card;

const PlayButton = ({
  src,
  text,
  subText,
  onclick,
}: {
  src: string;
  text: string;
  subText: string;
  onclick?: () => void;
}) => {
  return (
    <Button
      onClick={onclick}
      className=" w-fit h-fit md:w-72 md:text-xl grid grid-cols-4 hover:bg-slate-900 text-white px-4"
    >
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
