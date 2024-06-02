import express from "express";
import verifyToken from "../middlewares/auth";

const router = express.Router();

import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} from "../controllers/job.controllers";

router.post("/", verifyToken, createJob);
router.get("/", getJobs);
router.put("/:jobId", verifyToken, updateJob);
router.delete("/:jobId", verifyToken, deleteJob);

export default router;
