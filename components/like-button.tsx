"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { articlesService } from "@/lib/api/articles.service"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  articleId: string
  initialLikes: number
  initialIsLiked?: boolean
}

export function LikeButton({ articleId, initialLikes, initialIsLiked = false }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    setIsLoading(true)
    try {
      if (isLiked) {
        await articlesService.unlikeArticle(articleId)
        setLikes((prev) => prev - 1)
        setIsLiked(false)
      } else {
        await articlesService.likeArticle(articleId)
        setLikes((prev) => prev + 1)
        setIsLiked(true)
      }
    } catch (err) {
      toast.error("Failed to update like. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={cn("gap-2 transition-all", isLiked && "bg-pastel-pink border-pastel-pink hover:bg-pastel-pink/90")}
    >
      <Heart className={cn("h-4 w-4 transition-all", isLiked && "fill-current")} />
      <span>{likes}</span>
    </Button>
  )
}
