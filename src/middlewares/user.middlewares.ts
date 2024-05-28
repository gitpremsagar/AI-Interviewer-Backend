import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validateSignUpForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signUpFormSchema = z
    .object({
      email: z.string().email(),
      firstName: z
        .string()
        .min(2, {
          message: "First name must be at least 2 characters.",
        })
        .transform((val) => val.trim()),
      lastName: z
        .string()
        .min(2, {
          message: "Last name must be at least 2 characters.",
        })
        .transform((val) => val.trim()),
      password: z
        .string()
        .min(8, {
          message: "Password must be at least 8 characters.",
        })
        .transform((val) => val.trim()),
      confirmPassword: z.string(),
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
  } catch (error: any) {
    res.status(400).json({ message: error.errors });
  }
};

const validateLoginForm = (req: Request, res: Response, next: NextFunction) => {
  const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = req.body;

  try {
    loginFormSchema.parse({ email, password });
    next();
  } catch (error: any) {
    res.status(400).json({ message: error.errors });
  }
};

export { validateSignUpForm, validateLoginForm };
