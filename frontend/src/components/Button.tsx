import React from "react";

interface props {
  text: string;
  variant?: "dark" | "white";
  onclick?: () => void;
  styles?: string;
}

const Button: React.FC<props> = ({ text, variant, onclick, styles }) => {
  return (
    <div
      className={`${
        variant === "dark"
          ? "bg-green-800 hover:bg-green-700"
          : "bg-slate-100 hover:bg-green-100 text-black"
      } flex justify-center items-center p-2 hover:cursor-pointer rounded-md ${styles}`}
      onClick={onclick}
    >
      {text}
    </div>
  );
};

export default Button;
