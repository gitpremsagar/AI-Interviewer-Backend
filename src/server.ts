import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

// route handlers
import messageRouteHandler from "./routes/message.routes";
import userRouteHandler from "./routes/user.routes";
import conversationRouteHandler from "./routes/conversation.routes";
import jobRouteHandler from "./routes/job.routes";
import skillRouteHandler from "./routes/skill.routes";

// Set up CORS
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// define public folder
app.use(express.static("public"));

app.use("/message", messageRouteHandler);
app.use("/user", userRouteHandler);
app.use("/conversation", conversationRouteHandler);
app.use("/job", jobRouteHandler);
app.use("/skill", skillRouteHandler);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

console.log("BACKEND_DOMAIN = ", process.env.BACKEND_DOMAIN);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
