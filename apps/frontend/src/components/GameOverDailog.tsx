import { GAME_RESULT, GAME_STATUS } from "@/utils/utils";
import CustomButton from "./Button";
import XIcon from "@/icons/XIcon";

const GameOverDialog = ({
  status,
  result,
  setIsGameOver,
}: {
  status: GAME_STATUS;
  result: GAME_RESULT;
  setIsGameOver: any;
}) => {
  if (!status || !result) {
    return (
      <>
        <div className=" w-screen h-screen absolute opacity-80 bg-dark"></div>
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-fit md:w-72 min-w-fit rounded-lg bg-dark">
          <div className=" relative">
            <div className=" h-6 cursor-pointer flex flex-1 justify-end w-full px-2 absolute hover:brightness-75">
              <XIcon />
            </div>
            <div className=" flex flex-col gap-2 md:text-lg font-normal items-center justify-center p-8 mt-2">
              <h1 className=" font-bold mb-4">Game Not Over yet!!</h1>
              <CustomButton>Go Back</CustomButton>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className=" w-screen h-screen absolute opacity-80 bg-dark"></div>
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-fit md:w-72 min-w-fit rounded-lg p-8 bg-black">
        <div className=" relative">
          <div
            onClick={() => setIsGameOver(false)}
            className=" h-6 cursor-pointer flex flex-1 justify-end w-full absolute hover:brightness-75"
          >
            <XIcon />
          </div>
          <div className=" flex flex-col gap-2 md:text-lg font-normal items-center justify-center p-2 mt-2">
            <h1 className=" font-bold mb-4">Game Over</h1>
            <div className=" flex flex-col justify-center items-center gap-2 mb-4">
              <span className="">{result} </span>
              <span className=" text-sm">status: {status} </span>
            </div>
            <CustomButton className=" bg-green-700 hover:bg-green-800 transform duration-300">
              Play Again
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameOverDialog;
