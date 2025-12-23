"use client"
import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"

interface CommentListProps {
  articleId: string
}

export function CommentList({ articleId }: CommentListProps) {
  const { isAuthenticated } = useAuth()
  const [newComment, setNewComment] = useState("")

  // Showing a placeholder UI for future implementation
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-serif font-bold">Comments</h3>

      <div className="border border-border rounded-lg p-6 text-center space-y-3">
        <p className="text-muted-foreground">
          Comments feature coming soon! Your backend API doesn't include comment endpoints yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Once the comments API is added to your backend, this section will be fully functional.
        </p>
      </div>
    </div>
  )
}
