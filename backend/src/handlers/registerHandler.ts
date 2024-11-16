import { Request, Response } from "express";

export const registerHandler = async (req: Request, res: Response) => {
  const { username, password } = await req.body();

  res.json({
    username,
    password,
  });
};
