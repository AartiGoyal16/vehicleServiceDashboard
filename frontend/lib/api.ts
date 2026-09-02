/**
 * Base API URL for backend API requests.
 * Checks NEXT_PUBLIC_API_URL and API_URL environment variables,
 * falling back to local Django server at http://127.0.0.1:8000.
 */
const rawUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://13.53.39.15:8000";
const cleanUrl = rawUrl.replace(/\/$/, "");

export const API_BASE_URL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
