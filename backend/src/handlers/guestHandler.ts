import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import jwt from "jsonwebtoken";
import { COOKIE_MAX_AGE, JWT_EXPIRES_IN } from "../constants";

export const guestHandler = async (req: Request, res: Response) => {
  const guestId = "guest-" + uuidv4();

  try {
    const guestUser = await db.user.create({
      data: {
        username: guestId,
        email: guestId + "@guest.com",
        password: "guest",
      },
    });

    const token = jwt.sign(
      { userId: guestUser.id, username: guestUser.username, isGuest: true },
      process.env.JWT_SECRET!,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.cookie("guest", token, {
      maxAge: COOKIE_MAX_AGE,
    });
    res.json({
      user: guestUser,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};
