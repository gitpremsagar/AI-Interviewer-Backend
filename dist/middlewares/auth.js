"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("Access Denied");
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // console.log("Access Token Expired");
            return res.status(401).send("Access Token Expired");
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.log("Invalid Access Token");
            return res.status(401).send("Invalid Access Token");
        }
        else {
            console.error(err);
            return res.status(401).send("Token Validation Failed");
        }
    }
};
exports.default = verifyToken;
