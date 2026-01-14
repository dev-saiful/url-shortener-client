// Auth Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

// URL Types
export interface Url {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
  expiresAt: string | null;
  createdAt: string;
}

export interface UrlStats extends Url {
  recentClicks: {
    clickedAt: string;
    userAgent: string | null;
    referer: string | null;
  }[];
}

export interface CreateUrlDto {
  originalUrl: string;
  customCode?: string;
  expiresAt?: string;
}

// Admin Types
export interface AdminUrl extends Url {
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  urlCount: number;
}

export interface UpdateRoleDto {
  role: "USER" | "ADMIN";
}

// Error Types
export interface ApiError {
  message: string | string[];
  error?: string;
  statusCode: number;
}
