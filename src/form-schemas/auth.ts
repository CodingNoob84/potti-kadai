import { z } from "zod";

export const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(3, "Must be 3+ chars"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Must be at least 6 characters")
      .regex(/[a-z]/, "Must include lowercase letter")
      .regex(/[A-Z]/, "Must include uppercase letter")
      .regex(/[0-9]/, "Must include number")
      .regex(/[^a-zA-Z0-9]/, "Must include special character"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
