"use client";
import React, { useState } from "react";

import Input from "./Input";
import GoogleButton from "./GoogleButton";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserStrore } from "@/store/userStore";
import { toast } from "react-toastify";
import CustomButton from "./Button";

export const URL_PASSWORD_REGISTER = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`;
export const URL_PASSWORD_LOGIN = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;
export const URL_GOOGLE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const { setToken, setUser } = useUserStrore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(URL_PASSWORD_REGISTER, formData);
      const response = await axios.post(
        URL_PASSWORD_LOGIN,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      toast("User Registered successfully", { type: "success" });

      setToken(response.data.token);
      setUser(response.data.user);

      router.push("/");
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
          value={formData.username}
          onChange={handleInputChange}
        />
        <Input
          type="email"
          placeholder="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <Input
          type="password"
          placeholder="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <CustomButton onClick={handleSubmit} className=" md:w-72 my-2 py-4">
          Register
        </CustomButton>
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
