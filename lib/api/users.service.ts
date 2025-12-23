import { api } from "./axios-config"
import type { Article } from "./articles.service"

export interface User {
  id: string
  username: string
  email: string
  bio?: string
  created_at: string
}

export const usersService = {
  async getUserByUsername(username: string): Promise<User> {
    const response = await api.get(`/users/${username}`)
    return response.data
  },

  async getUserArticles(username: string): Promise<Article[]> {
    const response = await api.get(`/users/${username}/articles`)
    return response.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put("/users/me", data)
    // Update local storage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
    localStorage.setItem("user", JSON.stringify({ ...currentUser, ...response.data }))
    return response.data
  },
}
