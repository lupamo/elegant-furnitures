'use server'

import { signIn, signOut } from "@/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { z } from "zod"

const RegisterSchema = z.object({
  email: z.string().min(1, "Email is required").refine(
    (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    { message: "Invalid email address" }
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").refine(
    (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    { message: "Invalid email address" }
  ),
  password: z.string().min(1, "Password is required"),
})

// Register new user
export async function register(formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message
    }
  }

  const { email, password, name } = validatedFields.data

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: "Email already registered" }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "USER", 
      }
    })

    return { success: true }
  } catch (error) {
    return { error: "Failed to create account" }
  }
}

// Login user
export async function login(formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message
    }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}

// Logout user
export async function logout() {
  await signOut({ redirectTo: "/login" })
}
