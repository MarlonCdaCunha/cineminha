"use client"

import { useEffect, useState } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Star, Tv, Calendar, User2, Tag, ListChecks } from "lucide-react"
import { EditSeriesDialog } from "./edit-series-dialog"
import { getPosterUrl } from "@/lib/tmdb"

interface Series {
  id: string
  title: string
  creator: string
  year: number
  genre: string
  status: "completed" | "watching" | "to_watch"
  current_season?: number
  current_episode?: number
  total_seasons?: number
  rating?: number
  notes?: string
  created_at: string
  tmdb_id?: number
  poster_path?: string | null
}

interface SeriesListProps {
  userId: string
  supabase: SupabaseClient
}

export function SeriesList({ userId, supabase }: SeriesListProps) {
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSeries, setEditingSeries] = useState<Series | null>(null)

  useEffect(() => {
    fetchSeries()
  }, [userId])

  const fetchSeries = async () => {
    try {
      setLoading(true)

      // Check if supabase is available
      if (!supabase) {
        throw new Error("Cliente Supabase não inicializado")
      }

      const { data, error } = await supabase
        .from("series")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setSeriesList(data || [])
    } catch (error) {
      console.error("Erro ao buscar séries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta série?")) return

    // Check if supabase is available
    if (!supabase) {
      console.error("Cliente Supabase não inicializado")
      return
    }

    try {
      const { error } = await supabase.from("series").delete().eq("id", id)

      if (error) {
        throw error
      }

      setSeriesList(seriesList.filter((series) => series.id !== id))
    } catch (error) {
      console.error("Erro ao excluir série:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "watching":
        return "bg-blue-500"
      case "to_watch":
        return "bg-cinema-gold text-black"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída"
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
        <Tv className="h-12 w-12 text-cinema-gold animate-pulse mx-auto mb-4" />
        <div>Carregando séries...</div>
      </div>
    )
  }

  if (seriesList.length === 0) {
    return (
      <div className="text-center py-12">
        <Tv className="h-16 w-16 text-cinema-gold mx-auto mb-4 opacity-50" />
        <p className="text-gray-400 mb-4">Você ainda não adicionou nenhuma série.</p>
        <p className="text-sm text-gray-500">Clique no botão "Adicionar Série" acima para começar a criar sua lista.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {seriesList.map((series) => (
        <Card key={series.id} className="series-card border-cinema-gray bg-cinema-gray/30 text-white overflow-hidden">
          <div className="flex h-full">
            {series.poster_path && (
              <div className="w-1/3 flex-shrink-0">
                <img
                  src={getPosterUrl(series.poster_path, "medium") || "/placeholder.svg"}
                  alt={series.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/images/no-poster.png"
                  }}
                />
              </div>
            )}
            <div className={`flex flex-col ${series.poster_path ? "w-2/3" : "w-full"}`}>
              <CardHeader className="pb-2 relative">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-cinema-gold">{series.title}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(series.status)}>
                    {getStatusText(series.status)}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {series.year} • <User2 className="h-3 w-3" /> {series.creator}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col gap-2">
                  <div className="text-sm flex items-center gap-1">
                    <Tag className="h-3 w-3 text-cinema-gold" />
                    <span className="font-medium text-gray-300">Gênero:</span>
                    <span className="text-white">{series.genre}</span>
                  </div>
                  {series.status === "watching" && (
                    <div className="text-sm flex items-center gap-1">
                      <ListChecks className="h-3 w-3 text-blue-400" />
                      <span className="font-medium text-gray-300">Progresso:</span>
                      <span className="text-white">
                        T{series.current_season} E{series.current_episode}
                        {series.total_seasons && ` (de ${series.total_seasons} temporadas)`}
                      </span>
                    </div>
                  )}
                  {series.rating && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm text-gray-300">Avaliação:</span>
                      <div className="flex items-center">
                        {Array.from({ length: series.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-cinema-gold text-cinema-gold" />
                        ))}
                        {Array.from({ length: 5 - series.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-600" />
                        ))}
                      </div>
                    </div>
                  )}
                  {series.notes && (
                    <div className="text-sm mt-2">
                      <span className="font-medium text-gray-300">Notas:</span>
                      <p className="text-gray-400 mt-1 line-clamp-3">{series.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t border-cinema-gray/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSeries(series)}
                  className="text-gray-300 hover:text-white hover:bg-cinema-gray"
                >
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(series.id)}
                  className="text-gray-300 hover:text-red-500 hover:bg-cinema-gray"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Excluir
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}

      {editingSeries && (
        <EditSeriesDialog
          series={editingSeries}
          open={!!editingSeries}
          onOpenChange={(open) => {
            if (!open) setEditingSeries(null)
          }}
          onSave={() => {
            setEditingSeries(null)
            fetchSeries()
          }}
          supabase={supabase}
        />
      )}
    </div>
  )
}
