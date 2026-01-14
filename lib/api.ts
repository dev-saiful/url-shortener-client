import type {
  User,
  AuthResponse,
  LoginDto,
  RegisterDto,
  Url,
  UrlStats,
  CreateUrlDto,
  AdminUrl,
  AdminUser,
  UpdateRoleDto,
  ApiError,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export function getTokens() {
  if (typeof window !== "undefined" && !accessToken) {
    accessToken = localStorage.getItem("access_token");
    refreshToken = localStorage.getItem("refresh_token");
  }
  return { accessToken, refreshToken };
}

// Error parsing
export function parseError(error: ApiError): string {
  if (Array.isArray(error.message)) {
    return error.message[0];
  }
  return error.message || "An unexpected error occurred";
}

// Base fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const { accessToken: token } = getTokens();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token
  if (response.status === 401 && retry && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(endpoint, options, false);
    }
  }

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: "An unexpected error occurred",
      statusCode: response.status,
    }));
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken: refresh } = getTokens();
  if (!refresh) return false;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const data: AuthResponse = await response.json();
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

// ===== AUTH API =====
export const authApi = {
  register: (dto: RegisterDto) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  login: (dto: LoginDto) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  logout: async () => {
    const { refreshToken: refresh } = getTokens();
    if (refresh) {
      await apiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refresh }),
      }).catch(() => {});
    }
    clearTokens();
  },

  getMe: () => apiFetch<User>("/auth/me"),
};

// ===== URL API =====
export const urlApi = {
  create: (dto: CreateUrlDto) =>
    apiFetch<Url>("/urls", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  getInfo: (code: string) => apiFetch<Url>(`/urls/${code}`),

  getStats: (code: string) => apiFetch<UrlStats>(`/urls/${code}/stats`),

  delete: (code: string) =>
    apiFetch<void>(`/urls/${code}`, { method: "DELETE" }),

  getMyUrls: () => apiFetch<Url[]>("/users/me/urls"),
};

// ===== USER API =====
export const userApi = {
  getProfile: () => apiFetch<User>("/users/me"),

  updateProfile: (name: string) =>
    apiFetch<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
};

// ===== ADMIN API =====
export const adminApi = {
  getAllUrls: (page = 1, limit = 20, userId?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (userId) params.set("userId", userId);
    return apiFetch<AdminUrl[]>(`/admin/urls?${params}`);
  },

  deleteUrl: (code: string) =>
    apiFetch<void>(`/admin/urls/${code}`, { method: "DELETE" }),

  getAllUsers: (page = 1, limit = 20, role?: "USER" | "ADMIN") => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (role) params.set("role", role);
    return apiFetch<AdminUser[]>(`/admin/users?${params}`);
  },

  updateUserRole: (id: string, dto: UpdateRoleDto) =>
    apiFetch<AdminUser>(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    }),
};
