import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedUserToken } from "../types/user.type";

//extend the Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.header("Authorization");
  if (!bearer) return res.status(401).send("Access Denied");

  const token = bearer.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    req.user = decodedToken as DecodedUserToken;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

export default verifyToken;
