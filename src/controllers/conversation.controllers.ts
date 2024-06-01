import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: req.user.userId,
      },
    });
    res.json(conversations);
  } catch (error) {
    console.error("could not get conversations from db - ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateConversation = async (req: Request, res: Response) => {
  const { conversationId, conversationTitle } = req.body;

  try {
    const updatedConversation = await prisma.conversation.update({
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
  } catch (error) {
    console.error("could not update conversation on db - ", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.body;

  try {
    const deletedConversation = await prisma.conversation.delete({
      where: {
        conversationId,
      },
    });
    res.json({
      message: "Conversation deleted successfully",
      deletedConversation,
    });
  } catch (error) {
    console.error("could not delete conversation on db - ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getConversations, updateConversation, deleteConversation };
