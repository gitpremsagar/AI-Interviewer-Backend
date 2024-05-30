import { Router } from "express";
import {
  signUpUser,
  loginUser,
  logoutUser,
  getUserbyUserId,
  getAllUsers,
  refreshAccessToken,
  decodeAccessToken,
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

router.get("/", verifyToken, getAllUsers);

router.post("/refresh-access-token", refreshAccessToken);

router.get("/decode-access-token", verifyToken, decodeAccessToken);

//keep this route at the end to avoid conflicts with other routes
router.get("/:userId", getUserbyUserId);

export default router;
