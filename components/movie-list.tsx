"use client"

import { useEffect, useState } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Star, Film, Calendar, User2, Tag } from "lucide-react"
import { EditMovieDialog } from "./edit-movie-dialog"
import { getPosterUrl } from "@/lib/tmdb"

interface Movie {
  id: string
  title: string
  director: string
  year: number
  genre: string
  status: "watched" | "watching" | "to_watch"
  rating?: number
  notes?: string
  created_at: string
  tmdb_id?: number
  poster_path?: string | null
}

interface MovieListProps {
  userId: string
  supabase: SupabaseClient
}

export function MovieList({ userId, supabase }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)

  useEffect(() => {
    fetchMovies()
  }, [userId])

  const fetchMovies = async () => {
    try {
      setLoading(true)

      // Check if supabase is available
      if (!supabase) {
        throw new Error("Cliente Supabase não inicializado")
      }

      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erro do Supabase:", error.message, error.details, error.hint)
        throw new Error(`Erro do Supabase: ${error.message}`)
      }

      setMovies(data || [])
    } catch (error) {
      console.error("Erro ao buscar filmes:", error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este filme?")) return

    // Check if supabase is available
    if (!supabase) {
      console.error("Cliente Supabase não inicializado")
      return
    }

    try {
      const { error } = await supabase.from("movies").delete().eq("id", id)

      if (error) {
        throw error
      }

      setMovies(movies.filter((movie) => movie.id !== id))
    } catch (error) {
      console.error("Erro ao excluir filme:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "watched":
        return "bg-green-500"
      case "watching":
        return "bg-cinema-red"
      case "to_watch":
        return "bg-cinema-gold text-black"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "watched":
        return "Assistido"
      case "watching":
        return "Assistindo"
      case "to_watch":
        return "Para assistir"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-300">
        <Film className="h-12 w-12 text-cinema-red animate-pulse mx-auto mb-4" />
        <div>Carregando filmes...</div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <Film className="h-16 w-16 text-cinema-red mx-auto mb-4 opacity-50" />
        <p className="text-gray-400 mb-4">Você ainda não adicionou nenhum filme.</p>
        <p className="text-sm text-gray-500">Clique no botão "Adicionar Filme" acima para começar a criar sua lista.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie) => (
        <Card key={movie.id} className="movie-card border-cinema-gray bg-cinema-gray/30 text-white overflow-hidden">
          <div className="flex h-full">
            {movie.poster_path && (
              <div className="w-1/3 flex-shrink-0">
                <img
                  src={getPosterUrl(movie.poster_path, "medium") || "/placeholder.svg"}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/images/no-poster.png"
                  }}
                />
              </div>
            )}
            <div className={`flex flex-col ${movie.poster_path ? "w-2/3" : "w-full"}`}>
              <CardHeader className="pb-2 relative">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-cinema-gold">{movie.title}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(movie.status)}>
                    {getStatusText(movie.status)}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {movie.year} • <User2 className="h-3 w-3" /> {movie.director}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col gap-2">
                  <div className="text-sm flex items-center gap-1">
                    <Tag className="h-3 w-3 text-cinema-gold" />
                    <span className="font-medium text-gray-300">Gênero:</span>
                    <span className="text-white">{movie.genre}</span>
                  </div>
                  {movie.rating && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm text-gray-300">Avaliação:</span>
                      <div className="flex items-center">
                        {Array.from({ length: movie.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-cinema-gold text-cinema-gold" />
                        ))}
                        {Array.from({ length: 5 - movie.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-600" />
                        ))}
                      </div>
                    </div>
                  )}
                  {movie.notes && (
                    <div className="text-sm mt-2">
                      <span className="font-medium text-gray-300">Notas:</span>
                      <p className="text-gray-400 mt-1 line-clamp-3">{movie.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t border-cinema-gray/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMovie(movie)}
                  className="text-gray-300 hover:text-white hover:bg-cinema-gray"
                >
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(movie.id)}
                  className="text-gray-300 hover:text-red-500 hover:bg-cinema-gray"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Excluir
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}

      {editingMovie && (
        <EditMovieDialog
          movie={editingMovie}
          open={!!editingMovie}
          onOpenChange={(open) => {
            if (!open) setEditingMovie(null)
          }}
          onSave={() => {
            setEditingMovie(null)
            fetchMovies()
          }}
          supabase={supabase}
        />
      )}
    </div>
  )
}
