import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcryptjs";

export const registerHandler = async (req: Request, res: Response) => {
  const { username, email, password } = await req.body;

  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });

  if (user) {
    res.status(400).json({
      msg: "User already exists with that username",
    });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.json({
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};
