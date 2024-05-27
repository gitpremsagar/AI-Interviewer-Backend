import express from "express";
const app = express();
import cors from "cors";

// route handlers
import messageRouteHandler from "./routes/message.routes";
import userRouteHandler from "./routes/user.routes";

app.use(cors());
app.use(express.json());

app.use("/message", messageRouteHandler);
app.use("/user", userRouteHandler);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
