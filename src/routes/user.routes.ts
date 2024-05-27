import { Router } from "express";
import { signUpUser, loginUser } from "../controllers/user.controllers";
import { validateSignUpForm } from "../middlewares/user.middlewares";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/", validateSignUpForm, signUpUser);

router.post("/login", loginUser);

export default router;
