export interface Comment {
  id: string
  content: string
  author: {
    id: string
    username: string
    full_name?: string
    avatar_url?: string
  }
  article_id: string
  created_at: string
}

export interface CreateCommentData {
  content: string
}

// These service methods are kept for future implementation
export const commentsService = {
  async getCommentsByArticle(articleId: string): Promise<Comment[]> {
     const response = await api.get(`/articles/${id}/comments/`)
    return response.data
  },

  async createComment(articleId: string, data: CreateCommentData): Promise<Comment> {
    throw new Error("Comments feature not yet implemented in backend")
  },

  async deleteComment(articleId: string, commentId: string): Promise<void> {
    throw new Error("Comments feature not yet implemented in backend")
  },
}
