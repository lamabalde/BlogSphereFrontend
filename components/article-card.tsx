"use client"

import Link from "next/link"
import type { Article } from "@/lib/api/articles.service"
import { Heart, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = article.created_at
    ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true })
    : "Recently"

  const authorName = article.author  || "Anonymous"
  const authorInitial = authorName[0]?.toUpperCase() || "A"

  return (
    <Card className="group hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <Link href={`/article/${article.id}`}>
          <div className="space-y-3">
            {/* Author info */}
            <div className="flex items-center gap-3">
              
              <div className="flex flex-col">
                <span className="text-sm font-medium">{authorName}</span>
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
              </div>
            </div>

            {/* Article content */}
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold mb-2 group-hover:underline line-clamp-2 text-balance">
                {article.title || "Untitled"}
              </h2>
              <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base">
                {article.excerpt || "No excerpt available"}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{article.likes_count || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{article.views_count || 0}</span>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
