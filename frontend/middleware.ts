import { NextRequest } from "next/server";
import middleware from "next-auth/middleware";

// Explicitly export a function to satisfy the Next.js production compiler
export default function authMiddleware(req: NextRequest) {
  return (middleware as any)(req);
}

export const config = {
  // Protect all routes EXCEPT /login, /register, and API/static files
  matcher: ["/((?!login|register|api|_next/static|_next/image|favicon.ico).*)"]
};