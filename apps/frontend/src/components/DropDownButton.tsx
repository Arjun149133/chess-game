"use client";

import { Button } from "./ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

const DropDownButton = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className=" w-72 h-16 md:text-xl font-bold shadow-lg border-green-950 ">
            10 Min
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" bg-black w-72 md:text-xl text-white">
          <DropdownMenuItem className=" md:text-xl flex justify-center cursor-pointer">
            1 min
          </DropdownMenuItem>
          <DropdownMenuItem className=" md:text-xl flex justify-center cursor-pointer">
            3 min
          </DropdownMenuItem>
          <DropdownMenuItem className=" md:text-xl flex justify-center cursor-pointer">
            5 min
          </DropdownMenuItem>
          <DropdownMenuItem className=" md:text-xl flex justify-center cursor-pointer">
            10 min
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDownButton;
