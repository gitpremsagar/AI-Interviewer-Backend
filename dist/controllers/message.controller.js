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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesByConversationId = exports.startChat = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generative_ai_1 = require("@google/generative-ai");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const startChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, jobId, jobTitle, jobDescription } = req.body;
    let { conversationId, history } = req.body;
    const firstChatHistory = [
        {
            role: "user",
            parts: [
                {
                    text: `Act as an interviewer and take my interview. I'm going to apply for the job with following details:
          jobTitle: ${jobTitle}
          jobDescription: ${jobDescription}`,
                },
            ],
        },
        {
            role: "model",
            parts: [{ text: "Ok. Are you ready for the first question?" }],
        },
        {
            role: "user",
            parts: [{ text: "Yes. I'm Ready." }],
        },
        {
            role: "model",
            parts: [{ text: "First of all tell me your name." }],
        },
    ];
    history = [...firstChatHistory, ...history];
    // insert new conversation in db if its a new conversation
    if (conversationId === "newConversation") {
        //TODO:generate a new conversationtitle if its a new conversation
        const conversationTitle = "Conversation Title";
        try {
            const insertedConversation = yield prisma.conversation.create({
                data: {
                    conversationTitle,
                    user: {
                        connect: {
                            userId: req.user.userId,
                        },
                    },
                    job: {
                        connect: {
                            jobId,
                        },
                    },
                },
            });
            conversationId = insertedConversation.conversationId;
            // console.log("Conversation saved on db - ", insertedConversation);
        }
        catch (error) {
            console.error("could not save conversation on db - ", error);
        }
    }
    else {
        // check if conversationId belongs to the user
        try {
            const conversation = yield prisma.conversation.findUnique({
                where: {
                    conversationId,
                },
            });
            if (!conversation || conversation.userId !== req.user.userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
        }
        catch (error) {
            console.error("could not find conversation on db - ", error);
        }
    }
    // save message on db
    try {
        const addedMessage = yield prisma.message.create({
            data: {
                message: message,
                conversationId,
                sender: "user",
            },
        });
        // console.log("Message saved on db - ", addedMessage);
    }
    catch (error) {
        console.error("could not save msg on db - ", error);
    }
    // send message to Gemini
    try {
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });
        const result = yield chat.sendMessage(message);
        // console.log("gemini result = ", result);
        const response = yield result.response;
        const text = response.text();
        // console.log(text);
        // save Gemini's response on db
        try {
            const addedMessage = yield prisma.message.create({
                data: {
                    message: text,
                    conversationId: conversationId,
                    sender: "model",
                },
            });
            // console.log("Gemini's response saved on db - ", addedMessage);
        }
        catch (error) {
            console.error("could not save Gemini's response on db - ", error);
            return res
                .status(500)
                .json({ error: "could not save Gemini's response on db" });
        }
        // send Gemini's response to client with conversationId
        res.json({
            geminiResponse: text,
            conversationId,
        });
    }
    catch (error) {
        console.error("error while responding to chat message - ", error);
        res.status(500).json({ error: "GoogleGenerativeAI Error" });
    }
});
exports.startChat = startChat;
const getMessagesByConversationId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.params;
    // console.log("conversationId = ", conversationId);
    try {
        const messages = yield prisma.message.findMany({
            where: {
                conversationId: conversationId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.json(messages);
    }
    catch (error) {
        console.error("could not get messages from db - ", error);
        res.status(500).json({ error: "could not get messages from db" });
    }
});
exports.getMessagesByConversationId = getMessagesByConversationId;
