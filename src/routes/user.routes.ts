import { Router } from "express";
import {
  signUpUser,
  loginUser,
  logoutUser,
  getUserbyUserId,
  getAllUsers,
  refreshAccessToken,
} from "../controllers/user.controllers";
import {
  validateSignUpForm,
  validateLoginForm,
} from "../middlewares/user.middlewares";
import verifyToken from "./../middlewares/auth";

const router = Router();

router.post("/", validateSignUpForm, signUpUser);

router.post("/login", validateLoginForm, loginUser);

router.post("/logout", logoutUser);

router.get("/:userId", getUserbyUserId);

router.get("/", verifyToken, getAllUsers);

router.post("/refresh-access-token", refreshAccessToken);

export default router;
