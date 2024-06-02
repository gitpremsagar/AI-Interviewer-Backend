import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth";

import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controllers";

router.post("/", verifyToken, createSkill);
router.get("/", getSkills);
router.put("/:skillId", verifyToken, updateSkill);
router.delete("/:skillId", verifyToken, deleteSkill);

export default router;
