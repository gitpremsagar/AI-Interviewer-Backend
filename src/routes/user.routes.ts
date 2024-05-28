import { Router } from "express";
import {
  signUpUser,
  loginUser,
  getUserbyUserId,
  getAllUsers,
} from "../controllers/user.controllers";
import {
  validateSignUpForm,
  validateLoginForm,
} from "../middlewares/user.middlewares";
import verifyToken from "./../middlewares/auth";

const router = Router();

router.post("/", validateSignUpForm, signUpUser);

router.post("/login", validateLoginForm, loginUser);

router.get("/:userId", getUserbyUserId);

router.get("/", verifyToken, getAllUsers);

export default router;
