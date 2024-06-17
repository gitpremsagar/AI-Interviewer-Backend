"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
const message_controller_1 = require("../controllers/message.controller");
router.post("/", auth_1.default, message_controller_1.startChat);
// get messages by conversationId
router.get("/:conversationId", message_controller_1.getMessagesByConversationId);
exports.default = router;
