"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { TMDbMovieResult, TMDbSeriesResult } from "@/app/actions/tmdb-actions"
import { getPosterUrl, getGenreNames, extractYear } from "@/lib/tmdb"
import { Star, Calendar, Tag } from "lucide-react"

interface SearchResultsProps {
  results: TMDbMovieResult[] | TMDbSeriesResult[]
  onSelect: (result: TMDbMovieResult | TMDbSeriesResult) => void
  isLoading: boolean
  contentType: "movie" | "series"
}

export function SearchResults({ results, onSelect, isLoading, contentType }: SearchResultsProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="py-2 text-center text-gray-400">
        <div className="animate-pulse">Buscando...</div>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="max-h-[300px] overflow-y-auto py-2 space-y-2">
      <div className="text-sm text-gray-400 mb-2">
        {results.length} {contentType === "movie" ? "filmes" : "séries"} encontrados
      </div>
      {results.map((result) => {
        const isMovie = "title" in result
        const title = isMovie ? result.title : result.name
        const year = extractYear(isMovie ? result.release_date : result.first_air_date)
        const posterUrl = getPosterUrl(result.poster_path, "small")
        const genres = getGenreNames(result.genre_ids)
        const rating = Math.round(result.vote_average / 2) // Convertendo de 0-10 para 0-5

        return (
          <Card
            key={result.id}
            className={`border-cinema-gray bg-cinema-gray/30 text-white overflow-hidden cursor-pointer transition-all hover:bg-cinema-gray/50 ${
              selectedId === result.id ? "ring-2 ring-cinema-red" : ""
            }`}
            onClick={() => {
              setSelectedId(result.id)
              onSelect(result)
            }}
          >
            <CardContent className="p-3 flex gap-3">
              <div className="flex-shrink-0 w-12 h-18 overflow-hidden rounded">
                <img
                  src={posterUrl || "/placeholder.svg"}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/images/no-poster.png"
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-cinema-gold truncate">{title}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Calendar className="h-3 w-3" /> {year || "N/A"}
                </div>
                {genres && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Tag className="h-3 w-3" /> {genres}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Star className="h-3 w-3 text-cinema-gold" /> {result.vote_average.toFixed(1)}/10
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
