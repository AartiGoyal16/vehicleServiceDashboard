/**
 * Base API URL for backend API requests.
 * Uses NEXT_PUBLIC_API_URL or API_URL environment variable,
 * defaulting to live AWS backend at https://13.53.39.15.
 */
const rawUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://13.53.39.15";
const cleanUrl = rawUrl.replace(/\/$/, "");

export const API_BASE_URL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
