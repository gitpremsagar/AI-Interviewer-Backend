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
  // const bearer = req.header("Authorization");
  // if (!bearer) return res.status(401).send("Access Denied");

  // const token = bearer.split(" ")[1];

  const token = req.cookies.token;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    req.user = decodedToken as DecodedUserToken;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.log("Access Token Expired");
      return res.status(401).send("Access Token Expired");
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.log("Invalid Access Token");
      return res.status(400).send("Invalid Access Token");
    } else {
      console.error(err);
      return res.status(400).send("Token Validation Failed");
    }
  }
};

export default verifyToken;
