import Image from "next/image";

export const ProfileCard = ({
  src,
  username,
}: {
  src?: string;
  username?: string;
}) => {
  if (!username) return null;
  if (username.length > 15) {
    username = username.slice(0, 10) + "...";
  }
  return (
    <div className=" flex space-x-3 w-full py-4">
      <div>
        <Image
          src={
            src ??
            "https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif"
          }
          width={50}
          height={50}
          alt="opponent"
          className=" cursor-pointer"
        />
      </div>
      <div>
        <div className=" text-white ">{username}</div>
      </div>
    </div>
  );
};
