import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { COOKIE_MAX_AGE } from "../lib/constants";
import { jwtClaims, UserDetails } from "../lib/types";

export const refreshHandler = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as UserDetails;

    const token = jwt.sign(
      { username: user.username, userId: user.id, isGuest: false },
      process.env.JWT_SECRET!
    );

    res.cookie("token", token, { maxAge: COOKIE_MAX_AGE });
    res.status(200).json({
      token: token,
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture,
      isGuest: false,
    });
  } else if (req.cookies && req.cookies.token) {
    const decoded = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET!
    ) as jwtClaims;

    const token = jwt.sign(
      { username: decoded.username, userId: decoded.userId, isGuest: false },
      process.env.JWT_SECRET!
    );

    const user: UserDetails = {
      username: decoded.username,
      id: decoded.userId,
      isGuest: false,
      token: token,
    };

    res.cookie("token", token, { maxAge: COOKIE_MAX_AGE });
    res.status(200).json(user);
  } else if (req.cookies && req.cookies.guest) {
    const decoded = jwt.verify(
      req.cookies.guest,
      process.env.JWT_SECRET!
    ) as jwtClaims;

    const token = jwt.sign(
      { username: decoded.username, userId: decoded.userId, isGuest: false },
      process.env.JWT_SECRET!
    );

    const user: UserDetails = {
      username: decoded.username,
      id: decoded.userId,
      isGuest: true,
      token: token,
    };

    res.cookie("guest", token, { maxAge: COOKIE_MAX_AGE });
    res.status(200).json(user);
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
