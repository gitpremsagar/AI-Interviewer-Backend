import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const signUpUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(
    password,
    +process.env.BCRYPT_SALT_ROUNDS!
  );

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  res.json(newUser);
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(user);
};

const getUser = async (req: Request, res: Response) => {
  const userId = req.body.userId;

  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

export { signUpUser, loginUser, getUser };
