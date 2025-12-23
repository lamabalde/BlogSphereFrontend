"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { articlesService, type Article } from "@/lib/api/articles.service"
import { LikeButton } from "@/components/like-button"
import { CommentList } from "@/components/comment-list"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { Button } from "@/components/ui/button"
import { Eye, Calendar } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string

  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (articleId) {
      loadArticle()
    }
  }, [articleId])

  const loadArticle = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await articlesService.getArticleById(articleId)
      setArticle(data)
    } catch (err: any) {
      console.error("[v0] Error loading article:", err)
      if (err.response?.status === 404) {
        setError("Article not found")
      } else {
        setError("Failed to load article. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage message={error} />
        <Button onClick={() => router.push("/")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Article Header */}
      <header className="mb-8 space-y-6">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight text-balance">{article.title}</h1>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <Link
            href={`/profile/${article.author?.username || "unknown"}`}
            className="flex items-center gap-3 hover:opacity-80"
          >
            {article.author?.avatar_url ? (
              <img
                src={article.author.avatar_url || "/placeholder.svg"}
                alt={article.author || "User"}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-lg font-medium text-primary-foreground">
                  {article.author?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">{  article.author || "Unknown User"}</p>
              <p className="text-sm text-muted-foreground">@{article.author || "unknown"}</p>
            </div>
          </Link>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(article.created_at), "MMMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{article.views_count || 0} views</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <LikeButton articleId={article.id} initialLikes={article.likes_count || 0} />
        </div>
      </header>

      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none mb-12 [&_h1]:text-4xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_p]:leading-relaxed [&_p]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-pastel-mint [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:my-4 [&_ol]:my-4"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Comments Section */}
      <div className="border-t border-border pt-8">
        {/* <CommentList articleId={article.id} /> */}
      </div>
    </article>
  )
}
