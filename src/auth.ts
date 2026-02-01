import NextAuth from "next-auth"
import { prisma } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identification: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          console.log("Authorize called with:", credentials)

          if (!credentials?.identification) {
            console.log("Missing identification")
            return null
          }

          console.log("Searching user with:", credentials.identification)

          const input = (credentials.identification as string).trim()

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { identification: input },
                { email: input }
              ]
            }
          })

          console.log("User search result:", user ? `Found ID: ${user.id} Email: ${user.email}` : "Not Found")

          if (!user || !user.password) {
            console.log("User not found or no password")
            return null
          }

          const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)

          if (!passwordsMatch) {
            console.log("Password invalid")
            return null
          }

          console.log("User found:", user.id)
          return user
        } catch (error) {
          console.error("Authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.balance = (user as any).balance
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).balance = token.balance as number;
      }
      return session
    },
    async signIn({ user, account }) {
      // Manual user creation/linking logic for Google (Keep as is, but optional now)
      return true
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: "super-secret-fixed-string-dev-123", // HARDCODED FOR DEBUGGING
  trustHost: true,
})
