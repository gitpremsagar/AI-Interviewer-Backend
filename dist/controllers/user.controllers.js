"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAccessToken = exports.refreshAccessToken = exports.getAllUsers = exports.getUserbyUserId = exports.logoutUser = exports.loginUser = exports.signUpUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, +process.env.BCRYPT_SALT_ROUNDS);
        const newUser = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signUpUser = signUpUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "invalid email or password" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "invalid email or password" });
        }
        // create access token
        const token = jsonwebtoken_1.default.sign({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        // create refresh token
        const refreshToken = jsonwebtoken_1.default.sign({
            userId: user.userId,
        }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
        // save or update the refresh token in the database
        yield prisma.auth.upsert({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(200).json({ message: "Already logged out" });
    }
    // remove the refresh token from the database
    yield prisma.auth.deleteMany({
        where: {
            refreshToken: refreshToken,
        },
    });
    res
        .clearCookie("token")
        .clearCookie("refreshToken")
        .json({ message: "Logout successful" });
});
exports.logoutUser = logoutUser;
const getUserbyUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield prisma.user.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserbyUserId = getUserbyUserId;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            select: {
                userId: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllUsers = getAllUsers;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token not found" });
    }
    // verify the refresh token
    let decodedRefreshToken;
    try {
        decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.log("Refresh Token expired");
            return res.status(401).json({ message: "Refresh Token expired" });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.log("Invalid Refresh token");
            return res.status(401).json({ message: "Invalid Refresh token" });
        }
        else {
            console.error(error);
            return res
                .status(401)
                .json({ message: "Refresh Token validation failed" });
        }
    }
    // check if the refresh token exists in the database
    const authorisedUser = yield prisma.auth.findFirst({
        where: {
            refreshToken: refreshToken,
        },
    });
    if (!authorisedUser) {
        return res.status(401).json({ message: "User not authorised" });
    }
    // get the user details from the database
    const user = yield prisma.user.findUnique({
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
    const token = jsonwebtoken_1.default.sign({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    // send the new access token as an httpOnly cookie
    res
        .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: process.env.BACKEND_DOMAIN,
    })
        .json({ message: "Token refreshed" });
});
exports.refreshAccessToken = refreshAccessToken;
const decodeAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("decoded token = ", req.user);
    res.json(req.user); //req.user has decoded value and is set by the verifyToken middleware
});
exports.decodeAccessToken = decodeAccessToken;
