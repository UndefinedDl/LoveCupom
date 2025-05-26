import { authOptions } from '@/constants/constants'
import NextAuth from 'next-auth'

// Extend NextAuth types to include 'id' on session.user
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
