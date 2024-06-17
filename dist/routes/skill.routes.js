"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middlewares/auth"));
const skill_controllers_1 = require("../controllers/skill.controllers");
router.post("/", auth_1.default, skill_controllers_1.createSkill);
router.get("/", skill_controllers_1.getSkills);
router.put("/:skillId", auth_1.default, skill_controllers_1.updateSkill);
router.delete("/:skillId", auth_1.default, skill_controllers_1.deleteSkill);
exports.default = router;
