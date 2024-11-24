import React from "react";
import { Button } from "./ui/button";

const variants = {
  primary: "bg-black",
  secondary: "bg-green-800 hover:bg-green-700",
};

const CustomButton = ({
  onClick,
  className,
  children,
  variant = "primary",
}: {
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) => {
  return (
    <Button
      onClick={onClick}
      className={`flex items-center justify-center w-full ${variants[variant]} text-white py-2 px-4 rounded font-light  ${className}`}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
