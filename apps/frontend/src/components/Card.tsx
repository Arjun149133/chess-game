import Image from "next/image";
import { Button } from "./ui/button";
import DropDownButton from "./DropDownButton";
import Link from "next/link";

const match = false;

const moves = [
  { from: "e2", to: "e4" },
  { from: "e7", to: "e5" },
  { from: "g1", to: "f3" },
  { from: "b8", to: "c6" },
  { from: "f1", to: "c4" },
  { from: "g8", to: "f6" },
  { from: "e1", to: "g1" },
  { from: "f8", to: "e7" },
];

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
            link="/play/online"
          />
          <PlayButton
            src="https://www.chess.com/bundles/web/images/color-icons/handshake.svg"
            text="Play Friend"
            subText="Play with a Friend"
            link="/play/friend"
          />
          <PlayButton
            src="https://www.chess.com/bundles/web/images/color-icons/cute-bot.svg"
            text="Play Bots"
            subText="Play with a Bot"
            link="/play/bot"
          />
        </>
      ) : (
        <>
          {match ? (
            <div className=" flex flex-col justify-center items-center">
              <h1 className=" md:text-xl font-bold mb-4">Match</h1>
              <div>
                <div
                  className={`md:w-96 flex rounded-sm justify-between px-4 py-2 mx-2 my-1 capitalize font-normal`}
                >
                  <span>no.</span>
                  <span>from</span>
                  <span>to</span>
                </div>
                {moves.map((move, index) => (
                  <div
                    className={`md:w-96 flex rounded-sm justify-between px-4 py-2 mx-2 my-1 ${
                      index % 2 === 0 ? "" : " bg-black"
                    }`}
                  >
                    <span>{index + 1}.</span>
                    <span>{move.from} </span>
                    <span>{move.to} </span>
                  </div>
                ))}
              </div>
            </div>
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
        </>
      )}
    </div>
  );
};

export default Card;

const PlayButton = ({
  src,
  text,
  subText,
  link,
  onclick,
}: {
  src: string;
  text: string;
  subText: string;
  link: string;
  onclick?: () => void;
}) => {
  return (
    <div>
      <Link href={link}>
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
      </Link>
    </div>
  );
};