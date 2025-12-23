import { api } from "./axios-config"

export interface Article {
  id: string
  author: {
    id: string
    username: string
    email?: string
  }
  title: string
  content: string
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

export interface CreateArticleData {
  title: string
  content: string
  status: "draft" | "published"
}

// export interface ArticlesFilter {
//   sort_by?: "date" | "popularity" | "author"
//   author?: string
//   limit?: number
//   offset?: number
// }

export const articlesService = {
  async getArticles(): Promise<Article[]> {
    const response = await api.get("/articles/")
    return response.data
  },

  async getArticleById(id: string): Promise<Article> {
    const response = await api.get(`/articles/${id}/`)
    return response.data
  },

  async createArticle(data: CreateArticleData): Promise<Article> {
    const response = await api.post("/articles/", data)
    return response.data
  },

  async updateArticle(id: string, data: Partial<CreateArticleData>): Promise<Article> {
    const response = await api.patch(`/articles/${id}/`, data)
    return response.data
  },

  async deleteArticle(id: string): Promise<void> {
    await api.delete(`/articles/${id}/`)
  },

  async likeArticle(id: number): Promise<void> {
    await api.post(`/articles/${id==1}/like/`)
  },

  async unlikeArticle(id: string): Promise<void> {
    await api.delete(`/articles/${id}/like/`)
  },

  async getMyArticles(): Promise<Article[]> {
    const response = await api.get("/articles/")
    return response.data
  },
}
