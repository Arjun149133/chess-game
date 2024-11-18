"use client";
import React, { use, useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import GoogleButton from "./GoogleButton";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export const URL_PASSWORD = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`;
export const URL_GOOGLE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;

const RegisterForm = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(URL_PASSWORD, user);
      console.log(res);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleSubmit = () => {
    window.open(URL_GOOGLE, "_self");
  };

  return (
    <div className=" flex flex-col items-center h-screen pt-7">
      <div className=" grid grid-cols-12 w-full my-4">
        <div className="col-span-3"></div>
        <div className=" flex items-center col-span-2 hover:cursor-pointer">
          <Link href={"/"}>
            <Image
              src={"/arrow-left.svg"}
              alt="arrow-left"
              width={24}
              height={24}
            />
          </Link>
        </div>
        <span className=" col-span-7 text-4xl pl-20">chess</span>
      </div>
      <div className=" flex flex-col justify-center items-center">
        <h1 className=" text-2xl my-2">Enter your credentials.</h1>
        <Input
          type="text"
          placeholder="username"
          name="username"
          value={user.username}
          onChange={handleInputChange}
        />
        <Input
          type="email"
          placeholder="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
        />
        <Input
          type="password"
          placeholder="password"
          name="password"
          value={user.password}
          onChange={handleInputChange}
        />
        <Button styles=" w-72 my-2" variant="dark" onclick={handleSubmit}>
          Register
        </Button>
      </div>
      <div className="flex items-center my-4">
        <div className="flex-grow border-b border-gray-300 h-1 w-36"></div>
        <span className="mx-2 text-gray-500">or</span>
        <div className="flex-grow border-b border-gray-300 h-1 w-36"></div>
      </div>
      <div>
        <GoogleButton onclick={handleGoogleSubmit} />
      </div>
    </div>
  );
};

export default RegisterForm;
