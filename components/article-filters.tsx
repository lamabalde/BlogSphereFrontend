"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ArticleFiltersProps {
  sortBy: "date" | "popularity" | "author"
  onSortChange: (value: "date" | "popularity" | "author") => void
}

export function ArticleFilters({ sortBy, onSortChange }: ArticleFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Latest</SelectItem>
          <SelectItem value="popularity">Most Popular</SelectItem>
          <SelectItem value="author">Author</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
