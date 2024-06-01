import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient, Conversation } from "@prisma/client";

const prisma = new PrismaClient();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const startChat = async (req: Request, res: Response) => {
  const { history, message } = req.body;
  let { conversationId } = req.body;

  // insert new conversation in db if its a new conversation
  if (conversationId === "newConversation") {
    //TODO:generate a new conversationtitle if its a new conversation
    const conversationTitle = "Conversation Title";

    try {
      const insertedConversation = await prisma.conversation.create({
        data: {
          conversationTitle,
          user: {
            connect: {
              userId: req.user.userId,
            },
          },
        },
      });
      conversationId = insertedConversation.conversationId;
      // console.log("Conversation saved on db - ", insertedConversation);
    } catch (error) {
      console.error("could not save conversation on db - ", error);
    }
  } else {
    // check if conversationId belongs to the user
    try {
      const conversation = await prisma.conversation.findUnique({
        where: {
          conversationId,
        },
      });

      if (!conversation || conversation.userId !== req.user.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      console.error("could not find conversation on db - ", error);
    }
  }

  // save message on db
  try {
    const addedMessage = await prisma.message.create({
      data: {
        message: message,
        conversationId,
        sender: "user",
      },
    });
    // console.log("Message saved on db - ", addedMessage);
  } catch (error) {
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

    const result = await chat.sendMessage(message);
    // console.log(result);
    const response = await result.response;
    const text = response.text();
    // console.log(text);

    // save Gemini's response on db
    try {
      const addedMessage = await prisma.message.create({
        data: {
          message: text,
          conversationId: conversationId,
          sender: "model",
        },
      });
      // console.log("Gemini's response saved on db - ", addedMessage);
    } catch (error) {
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
  } catch (error) {
    res.status(500).json({ error: "GoogleGenerativeAI Error" });
  }
};

export { startChat };
