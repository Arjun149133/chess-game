import Image from "next/image";

const GoogleButton = () => {
  return (
    <div className=" flex justify-center items-center space-x-4 p-3 h-12 w-72 bg-gray-800 hover:bg-gray-700 rounded-md hover:cursor-pointer">
      <Image src={"/googleIcon.svg"} alt="googleIcon" height={24} width={24} />
      <span>Continue with Google</span>
    </div>
  );
};

export default GoogleButton;
