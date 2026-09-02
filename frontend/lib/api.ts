/**
 * Base API URL for backend API requests.
 * Uses NEXT_PUBLIC_API_URL environment variable when available (e.g. deployed on Vercel),
 * falling back to local Django server at http://127.0.0.1:8000.
 */
const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const cleanUrl = rawUrl.replace(/\/$/, "");

export const API_BASE_URL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
