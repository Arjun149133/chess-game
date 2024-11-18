import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { jwtClaims } from "../lib/types";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: "no token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwtClaims;

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Invalid Token access denied",
    });
    return;
  }
};
