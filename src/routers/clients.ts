import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../types";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req: Request, res: Response) => {
  console.log("Request body:", req.body);
  const user = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
  };
  console.log("Name:", user.name);
  console.log("Email:", user.email);
  console.log("Address:", user.address);
  console.log("Phone:", user.phone);
  if (!user.name || !user.email || !user.address || !user.phone) {
    res
      .status(400)
      .json({ error: "Please provide name, email, address, and phone" });
  }
  try {
    console.log("User:", user);
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
      },
    });
    res.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
