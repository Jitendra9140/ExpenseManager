import { z } from "zod"

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().or(z.string()).transform(val => 
    typeof val === "string" ? parseFloat(val) : val
  ),
  note: z.string().optional().nullable(),
  date: z.string().transform(val => new Date(val)), // Transform string to Date
  categoryId: z.string(),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name too long"),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type TransactionInput = z.infer<typeof transactionSchema>
export type CategoryInput = z.infer<typeof categorySchema>
