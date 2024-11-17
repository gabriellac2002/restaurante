import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req: Request, res: Response) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
  };

  if (!user.name || !user.email || !user.address || !user.phone) {
    return res
      .status(400)
      .json({ error: "Please provide name, email, address, and phone" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (existingUser) {
    return res.status(400).json({ error: "Email already in use" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
      },
    });
    return res.status(200).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const email = req.body.email;

  console.log(email);

  if (!email) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
