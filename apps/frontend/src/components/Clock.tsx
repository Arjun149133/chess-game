"use client";
const Clock = ({ time }: { time: number | undefined }) => {
  if (!time) {
    return null;
  }

  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time / 1000) % 60);

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return <div className="bg-gray-800 p-2 rounded-lg px-4">{formattedTime}</div>;
};

export default Clock;
