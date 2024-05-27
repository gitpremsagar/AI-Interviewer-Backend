import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import { GoogleGenerativeAI }from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getResponseFromGeminAI = async (req: Request, res: Response) => {
  const prompt = req.body.prompt;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not generate response.");
  }
};

const startChat = async (req: Request, res: Response) => {
  const { history, message } = req.body;

  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 100,
    },
  });  

  const result = await chat.sendMessage(message);
  // console.log(result);
  const response = await result.response;
  const text = response.text();
  // console.log(text);

  res.send(text);
  return;
};

export { getResponseFromGeminAI, startChat };