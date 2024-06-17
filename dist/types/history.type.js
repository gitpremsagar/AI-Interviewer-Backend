"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historySchema = void 0;
const zod_1 = require("zod");
const partSchema = zod_1.z.object({
    text: zod_1.z.string(),
});
const historySchema = zod_1.z.array(zod_1.z.object({
    role: zod_1.z.enum(["user", "model"]),
    parts: zod_1.z.array(partSchema),
}));
exports.historySchema = historySchema;
