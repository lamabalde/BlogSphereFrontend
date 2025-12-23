"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { usersService, type User } from "@/lib/api/users.service"
import type { Article } from "@/lib/api/articles.service"
import { ArticleCard } from "@/components/article-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { Calendar, FileText } from "lucide-react"
import { format } from "date-fns"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string

  const [user, setUser] = useState<User | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (username) {
      loadProfile()
    }
  }, [username])

  const loadProfile = async () => {
    setIsLoading(true)
    setError("")

    try {
      const [userData, userArticles] = await Promise.all([
        usersService.getUserByUsername(username),
        usersService.getUserArticles(username),
      ])
      setUser(userData)
      setArticles(userArticles)
    } catch (err: any) {
      console.error("[v0] Error loading profile:", err)
      if (err.response?.status === 404) {
        setError("User not found")
      } else {
        setError("Failed to load profile")
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

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="border-b border-border bg-gradient-to-b from-pastel-blue/20 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {user.avatar_url ? (
              <img
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.username}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center">
                <span className="text-4xl font-medium text-primary-foreground">{user.username[0].toUpperCase()}</span>
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-serif font-bold mb-2">{user.full_name || user.username}</h1>
              <p className="text-muted-foreground mb-4">@{user.username}</p>

              {user.bio && <p className="text-sm leading-relaxed mb-4">{user.bio}</p>}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(new Date(user.created_at), "MMMM yyyy")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>
                    {articles.length} {articles.length === 1 ? "article" : "articles"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Published Articles</h2>

        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No articles published yet.</p>
        ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
