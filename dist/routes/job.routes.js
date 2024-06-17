"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
const job_controllers_1 = require("../controllers/job.controllers");
router.post("/", auth_1.default, job_controllers_1.createJob);
router.get("/", job_controllers_1.getJobs);
router.put("/:jobId", auth_1.default, job_controllers_1.updateJob);
router.delete("/:jobId", auth_1.default, job_controllers_1.deleteJob);
router.post("/many", auth_1.default, job_controllers_1.createManyJobs);
exports.default = router;
