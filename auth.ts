// auth.ts (in root directory)
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google  from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"


const prisma = new PrismaClient()

type Role = "USER" | "ADMIN"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
	Google({
		clientId: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		allowDangerousEmailAccountLinking: true,
	}),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
	async signIn({ user, account }) {
		if (account?.provider === "google") {
			const dbUser = await prisma.user.findUnique({
				where: { email: user.email! }
			})
			if (dbUser && !dbUser.role) {
				await prisma.user.update({
					where: { email: user.email! },
					data: { role: "USER" }
				})
			}
		}
		return true
	},

    async jwt({ token, user, account }) {
      if (user) {
        // For OAuth users, fetch role from database
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          token.role = (dbUser?.role as Role) || "USER"
          token.id = user.id
        } else {
          // For credential users, role comes from authorize
          token.role = user.role as Role
          token.id = user.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as Role
        session.user.id = token.id as string
      }
      return session
    }
  }
})
