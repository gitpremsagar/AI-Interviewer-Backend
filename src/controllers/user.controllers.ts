import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const signUpUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

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

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    // create access token
    const token = jwt.sign(
      {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY!,
      }
    );

    // create refresh token
    const refreshToken = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.JWT_REFRESH_SECRET_KEY!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY! }
    );

    // save or update the refresh token in the database
    await prisma.auth.upsert({
      where: {
        userId: user.userId,
      },
      update: {
        refreshToken: refreshToken,
      },
      create: {
        userId: user.userId,
        refreshToken: refreshToken,
      },
    });

    // send the access token and refresh token as httpOnly cookies
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: process.env.BACKEND_DOMAIN,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: process.env.BACKEND_DOMAIN,
      })
      .json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  const refreshToken: string = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(200).json({ message: "Already logged out" });
  }

  const decodedRefreshToken = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET_KEY!
  ) as jwt.JwtPayload;

  // remove the refresh token from the database
  await prisma.auth.delete({
    where: {
      userId: decodedRefreshToken.userId,
    },
  });

  res
    .clearCookie("token")
    .clearCookie("refreshToken")
    .json({ message: "Logout successful" });
};

const getUserbyUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken: string = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not found" });
  }

  // verify the refresh token
  let decodedRefreshToken: jwt.JwtPayload;
  try {
    decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY!
    ) as jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Refresh Token expired");
      return res.status(401).json({ message: "Refresh Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log("Invalid Refresh token");
      return res.status(401).json({ message: "Invalid Refresh token" });
    } else {
      console.error(error);
      return res
        .status(401)
        .json({ message: "Refresh Token validation failed" });
    }
  }

  // check if the refresh token exists in the database
  const authorisedUser = await prisma.auth.findFirst({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!authorisedUser) {
    return res.status(401).json({ message: "User not authorised" });
  }

  // get the user details from the database
  const user = await prisma.user.findUnique({
    where: {
      userId: decodedRefreshToken.userId,
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  //just to make typescript happy
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // create a new access token
  const token = jwt.sign(
    {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY!,
    }
  );

  // send the new access token as an httpOnly cookie
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: process.env.BACKEND_DOMAIN,
    })
    .json({ message: "Token refreshed" });
};

const decodeAccessToken = async (req: Request, res: Response) => {
  // console.log("decoded token = ", req.user);
  res.json(req.user); //req.user has decoded value and is set by the verifyToken middleware
};

export {
  signUpUser,
  loginUser,
  logoutUser,
  getUserbyUserId,
  getAllUsers,
  refreshAccessToken,
  decodeAccessToken,
};
