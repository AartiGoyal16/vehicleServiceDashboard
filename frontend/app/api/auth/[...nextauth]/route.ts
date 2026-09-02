import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_URL } from "@/lib/api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Send credentials to Django JWT endpoint
        const res = await fetch(`${API_BASE_URL}/token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        
        const data = await res.json();
        
        // If successful, return the user and access token
        if (res.ok && data.access) {
          return { id: "1", name: credentials?.username, accessToken: data.access };
        }
        
        return null; // Login failed
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Pass the access token into the session payload
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login', 
  }
});

export { handler as GET, handler as POST };