import { Router } from "express";
import { db } from "../db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await db.user.findMany();

    res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
});

export default router;
