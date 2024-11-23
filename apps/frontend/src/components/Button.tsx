import React from "react";
import { Button } from "./ui/button";

const CustomButton = ({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Button
      onClick={onClick}
      className={`w-full bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded  ${className}`}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
