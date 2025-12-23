import { api } from "./axios-config"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user?: {
    id: string
    username: string
    email: string
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post("/auth/login/", credentials)
    const { access, refresh } = response.data

    if (access) {
      localStorage.setItem("auth_token", access)
      localStorage.setItem("refresh_token", refresh)
    }

    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post("/auth/register/", data)
    const { access, refresh } = response.data

    if (access) {
      localStorage.setItem("auth_token", access)
      localStorage.setItem("refresh_token", refresh)
    }

    return response.data
  },

  async refreshToken(): Promise<string> {
    const refresh = localStorage.getItem("refresh_token")
    if (!refresh) throw new Error("No refresh token available")

    const response = await api.post("/auth/refresh/", { refresh })
    const { access } = response.data

    localStorage.setItem("auth_token", access)
    return access
  },

  logout() {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token")
  },
}
