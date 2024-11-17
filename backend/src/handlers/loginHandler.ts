import { Request, response, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import jwt from "jsonwebtoken";
import { COOKIE_MAX_AGE, JWT_EXPIRES_IN } from "../constants";

export const loginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      msg: "Please provide both username and password",
    });
    return;
  }
  try {
    const user = await db.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      res.status(400).json({
        msg: "User does not exist",
      });
      return;
    }
    const hashedPassword = user.password!;
    const isMatch = bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      res.status(400).json({
        msg: "Invalid password",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, isGuest: false },
      process.env.JWT_SECRET!,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.cookie("token", token, {
      maxAge: COOKIE_MAX_AGE,
    });

    res.json({
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
    });
    return;
  }
};

export const loginFailed = (req: Request, res: Response) => {
  res.status(401).json({
    success: false,
    message: "login failed",
  });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("guest");
  res.clearCookie("token");
  req.logout((err) => {
    if (err) {
    } else {
      res.clearCookie("token");
      res.redirect(process.env.CLIENT_URL!);
    }
  });
};
