"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const user_middlewares_1 = require("../middlewares/user.middlewares");
const auth_1 = __importDefault(require("./../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/", user_middlewares_1.validateSignUpForm, user_controllers_1.signUpUser);
router.post("/login", user_middlewares_1.validateLoginForm, user_controllers_1.loginUser);
router.post("/logout", user_controllers_1.logoutUser);
router.get("/", auth_1.default, user_controllers_1.getAllUsers);
router.post("/refresh-access-token", user_controllers_1.refreshAccessToken);
router.get("/decode-access-token", auth_1.default, user_controllers_1.decodeAccessToken);
//keep this route at the end to avoid conflicts with other routes
router.get("/:userId", user_controllers_1.getUserbyUserId);
exports.default = router;
