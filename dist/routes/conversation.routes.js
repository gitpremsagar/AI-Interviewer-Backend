"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const conversation_controllers_1 = require("../controllers/conversation.controllers");
const router = express_1.default.Router();
router
    .route("/")
    .get(auth_1.default, conversation_controllers_1.getConversations)
    .put(auth_1.default, conversation_controllers_1.updateConversation)
    .delete(auth_1.default, conversation_controllers_1.deleteConversation);
exports.default = router;
