"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.updateConversation = exports.getConversations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversations = yield prisma.conversation.findMany({
            where: {
                userId: req.user.userId,
            },
            include: {
                job: true,
            },
        });
        res.json(conversations);
    }
    catch (error) {
        console.error("could not get conversations from db - ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getConversations = getConversations;
const updateConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, conversationTitle } = req.body;
    try {
        const updatedConversation = yield prisma.conversation.update({
            where: {
                conversationId,
            },
            data: {
                conversationTitle,
            },
        });
        res.json({
            message: "Conversation updated successfully",
            updatedConversation,
        });
    }
    catch (error) {
        console.error("could not update conversation on db - ", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.updateConversation = updateConversation;
const deleteConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.body;
    try {
        const deletedConversation = yield prisma.conversation.delete({
            where: {
                conversationId,
            },
        });
        res.json({
            message: "Conversation deleted successfully",
            deletedConversation,
        });
    }
    catch (error) {
        console.error("could not delete conversation on db - ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteConversation = deleteConversation;
