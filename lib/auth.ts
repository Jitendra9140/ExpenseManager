// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import { cookies } from "next/headers"
// import { prisma } from "@/lib/prisma"

// const JWT_SECRET = process.env.JWT_SECRET

// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET environment variable is not set")
// }

// // Type assertion to ensure TypeScript knows JWT_SECRET is a string
// const SECRET: string = JWT_SECRET

// export interface User {
//   id: string
//   name: string
//   email: string
// }

// export async function hashPassword(password: string): Promise<string> {
//   return bcrypt.hash(password, 12)
// }

// export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//   return bcrypt.compare(password, hashedPassword)
// }

// export function generateToken(user: User): string {
//   return jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: "7d" })
// }

// export function verifyToken(token: string): User | null {
//   try {
//     return jwt.verify(token, SECRET) as User
//   } catch {
//     return null
//   }
// }

// export async function getCurrentUser(): Promise<User | null> {
//   try {
//     // Check if we're in a server environment that supports cookies
//     if (typeof window !== 'undefined') {
//       // Client-side - cookies() won't work here
//       return null
//     }

//     const cookieStore = await cookies()
//     const token = cookieStore.get("auth-token")?.value

//     if (!token) return null

//     const user = verifyToken(token)
//     if (!user) return null

//     // Verify user still exists in database
//     const dbUser = await prisma.user.findUnique({
//       where: { id: user.id },
//       select: { id: true, name: true, email: true },
//     })

//     return dbUser
//   } catch (error) {
//     console.error('Error getting current user:', error)
//     return null
//   }
// }

// // Alternative function for client-side token verification
// export function getCurrentUserFromToken(token: string): User | null {
//   if (!token) return null
//   return verifyToken(token)
// }

// export async function createDefaultCategories(userId: string) {
//   const defaultCategories = [
//     "Food & Dining",
//     "Transportation",
//     "Shopping",
//     "Entertainment",
//     "Bills & Utilities",
//     "Healthcare",
//     "Salary",
//     "Freelance",
//     "Investment",
//     "Other",
//   ]

//   await prisma.category.createMany({
//     data: defaultCategories.map((name) => ({
//       name,
//       userId,
//     })),
//     skipDuplicates: true,
//   })
// }
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set")
}

const SECRET: string = JWT_SECRET
export interface User {
  id: string
  name: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, SECRET) as User
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const user = verifyToken(token)
    if (!user) return null

    // Verify user still exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true },
    })

    return dbUser
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function createDefaultCategories(userId: string) {
  const defaultCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Salary",
    "Freelance",
    "Investment",
    "Other",
  ]

  await prisma.category.createMany({
    data: defaultCategories.map((name) => ({
      name,
      userId,
    })),
    skipDuplicates: true,
  })
}
