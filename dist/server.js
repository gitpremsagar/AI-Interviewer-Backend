"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// route handlers
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const conversation_routes_1 = __importDefault(require("./routes/conversation.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const skill_routes_1 = __importDefault(require("./routes/skill.routes"));
// Set up CORS
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// define public folder
app.use(express_1.default.static("public"));
app.use("/message", message_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/conversation", conversation_routes_1.default);
app.use("/job", job_routes_1.default);
app.use("/skill", skill_routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
