import React from "react";

interface props {
  children: React.ReactNode;
  variant?: "dark" | "white";
  onclick?: () => void;
  styles?: string;
}

const Button: React.FC<props> = ({ variant, onclick, styles, children }) => {
  return (
    <div
      className={`${
        variant === "dark"
          ? "bg-green-800 hover:bg-green-700"
          : "bg-slate-100 hover:bg-green-100 text-black"
      } flex justify-center items-center p-2 hover:cursor-pointer rounded-md ${styles}`}
      onClick={onclick}
    >
      {children}
    </div>
  );
};

export default Button;
