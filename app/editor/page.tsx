

"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { articlesService } from "@/lib/api/articles.service"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { Save, Send, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// ---------------------------
// Simple Editor (Textarea)
// ---------------------------
interface SimpleEditorProps {
  content: string
  onChange: (value: string) => void
}

function SimpleEditor({ content, onChange }: SimpleEditorProps) {
  const [value, setValue] = useState(content)

  useEffect(() => {
    setValue(content)
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    onChange(e.target.value)
  }

  return (
    <Textarea
      value={value}
      onChange={handleChange}
      placeholder="Write your story..."
      className="min-h-[300px] w-full resize-none p-2"
    />
  )
}

// ---------------------------
// EditorContent
// ---------------------------
function EditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const articleId = searchParams.get("id")

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (articleId) loadArticle(articleId)
  }, [articleId])

  const loadArticle = async (id: string) => {
    setIsLoading(true)
    try {
      const article = await articlesService.getArticleById(id)
      setTitle(article.title)
      setExcerpt(article.excerpt)
      setContent(article.content)
    } catch {
      toast.error("Failed to load article")
      router.push("/editor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!title.trim()) return toast.error("Please enter a title")

    setIsSaving(true)
    try {
      const data = {
        title,
        excerpt: excerpt || title.substring(0, 150),
        content,
        is_published: false,
      }

      if (articleId) {
        await articlesService.updateArticle(articleId, data)
      } else {
        const article = await articlesService.createArticle(data)
        router.push(`/editor?id=${article.id}`)
      }

      toast.success("Draft saved")
    } catch {
      toast.error("Failed to save draft")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim())
      return toast.error("Title and content required")

    setIsPublishing(true)
    try {
      const data = {
        title,
        excerpt: excerpt || title.substring(0, 150),
        content,
        is_published: true,
      }

      let id = articleId

      if (articleId) {
        await articlesService.updateArticle(articleId, data)
      } else {
        const article = await articlesService.createArticle(data)
        id = article.id
      }

      toast.success("Article published")
      router.push(`/article/${id}`)
    } catch {
      toast.error("Failed to publish")
    } finally {
      setIsPublishing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold">Write your story</h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <Button onClick={handlePublish} disabled={isPublishing}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Title */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article title..."
        className="text-4xl font-serif border-none px-0"
      />

      {/* Excerpt */}
      <Textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Excerpt..."
        className="mt-4"
      />

      {/* Simple Textarea Editor */}
      <div className="mt-6">
        <SimpleEditor content={content} onChange={setContent} />
      </div>

      {/* Preview */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="mt-4">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif">{title || "Untitled"}</DialogTitle>
            <DialogDescription>{excerpt}</DialogDescription>
          </DialogHeader>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function EditorClient() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <LoadingSpinner />
          </div>
        }
      >
        <EditorContent />
      </Suspense>
    </ProtectedRoute>
  )
}
