import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedUserToken } from "../types/user.type";

//extend the Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user: DecodedUserToken;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    req.user = decodedToken as DecodedUserToken;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // console.log("Access Token Expired");
      return res.status(401).send("Access Token Expired");
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.log("Invalid Access Token");
      return res.status(401).send("Invalid Access Token");
    } else {
      console.error(err);
      return res.status(401).send("Token Validation Failed");
    }
  }
};

export default verifyToken;
