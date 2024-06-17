"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginForm = exports.validateSignUpForm = void 0;
const zod_1 = require("zod");
const validateSignUpForm = (req, res, next) => {
    const signUpFormSchema = zod_1.z
        .object({
        email: zod_1.z.string().email(),
        firstName: zod_1.z
            .string()
            .min(2, {
            message: "First name must be at least 2 characters.",
        })
            .transform((val) => val.trim()),
        lastName: zod_1.z
            .string()
            .min(2, {
            message: "Last name must be at least 2 characters.",
        })
            .transform((val) => val.trim()),
        password: zod_1.z
            .string()
            .min(8, {
            message: "Password must be at least 8 characters.",
        })
            .transform((val) => val.trim()),
        confirmPassword: zod_1.z.string(),
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match.",
        path: ["confirmPassword"],
    });
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    try {
        signUpFormSchema.parse({
            email,
            firstName,
            lastName,
            password,
            confirmPassword,
        });
        next();
    }
    catch (error) {
        console.log(error.errors);
        res.status(400).json({ message: error.errors });
    }
};
exports.validateSignUpForm = validateSignUpForm;
const validateLoginForm = (req, res, next) => {
    const loginFormSchema = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    });
    const { email, password } = req.body;
    try {
        loginFormSchema.parse({ email, password });
        next();
    }
    catch (error) {
        console.log(error.errors);
        res.status(400).json({ message: "invalid email or password" });
    }
};
exports.validateLoginForm = validateLoginForm;
