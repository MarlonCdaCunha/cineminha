"use client"

import { useState } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Tv, Calendar, User2, Tag, Star, ClipboardList, Pencil, ListChecks } from "lucide-react"

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
}

interface EditSeriesDialogProps {
  series: Series
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
  supabase: SupabaseClient
}

export function EditSeriesDialog({ series, open, onOpenChange, onSave, supabase }: EditSeriesDialogProps) {
  const [title, setTitle] = useState(series.title)
  const [creator, setCreator] = useState(series.creator)
  const [year, setYear] = useState(series.year)
  const [genre, setGenre] = useState(series.genre)
  const [status, setStatus] = useState(series.status)
  const [currentSeason, setCurrentSeason] = useState<number | undefined>(series.current_season)
  const [currentEpisode, setCurrentEpisode] = useState<number | undefined>(series.current_episode)
  const [totalSeasons, setTotalSeasons] = useState<number | undefined>(series.total_seasons)
  const [rating, setRating] = useState<number | undefined>(series.rating)
  const [notes, setNotes] = useState(series.notes || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!title || !creator || !year || !genre) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Check if supabase is available
    if (!supabase) {
      toast({
        title: "Erro",
        description: "Cliente Supabase não inicializado. Verifique suas variáveis de ambiente.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from("series")
        .update({
          title,
          creator,
          year,
          genre,
          status,
          current_season: currentSeason,
          current_episode: currentEpisode,
          total_seasons: totalSeasons,
          rating,
          notes,
        })
        .eq("id", series.id)

      if (error) throw error

      toast({
        title: "Série atualizada",
        description: "Sua série foi atualizada com sucesso",
      })

      onSave()
    } catch (error) {
      console.error("Erro ao atualizar série:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar série. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-cinema-dark border-cinema-gray text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cinema-gold">
            <Pencil className="h-5 w-5 text-cinema-gold" /> Editar Série
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right flex items-center gap-1 text-gray-300">
              <Tv className="h-4 w-4 text-cinema-gold" /> Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="creator" className="text-right flex items-center gap-1 text-gray-300">
              <User2 className="h-4 w-4 text-cinema-gold" /> Criador
            </Label>
            <Input
              id="creator"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right flex items-center gap-1 text-gray-300">
              <Calendar className="h-4 w-4 text-cinema-gold" /> Ano
            </Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number.parseInt(e.target.value) || 0)}
              className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genre" className="text-right flex items-center gap-1 text-gray-300">
              <Tag className="h-4 w-4 text-cinema-gold" /> Gênero
            </Label>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right flex items-center gap-1 text-gray-300">
              <ClipboardList className="h-4 w-4 text-cinema-gold" /> Status
            </Label>
            <Select value={status} onValueChange={(value) => setStatus(value as "completed" | "watching" | "to_watch")}>
              <SelectTrigger className="col-span-3 bg-cinema-gray border-cinema-gray text-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-cinema-dark border-cinema-gray text-white">
                <SelectItem value="to_watch">Para assistir</SelectItem>
                <SelectItem value="watching">Assistindo</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status === "watching" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentSeason" className="text-right flex items-center gap-1 text-gray-300">
                  <ListChecks className="h-4 w-4 text-blue-400" /> Temporada Atual
                </Label>
                <Input
                  id="currentSeason"
                  type="number"
                  value={currentSeason || ""}
                  onChange={(e) => setCurrentSeason(Number.parseInt(e.target.value) || undefined)}
                  className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentEpisode" className="text-right flex items-center gap-1 text-gray-300">
                  <ListChecks className="h-4 w-4 text-blue-400" /> Episódio Atual
                </Label>
                <Input
                  id="currentEpisode"
                  type="number"
                  value={currentEpisode || ""}
                  onChange={(e) => setCurrentEpisode(Number.parseInt(e.target.value) || undefined)}
                  className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
                />
              </div>
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalSeasons" className="text-right flex items-center gap-1 text-gray-300">
              <ListChecks className="h-4 w-4 text-cinema-gold" /> Total de Temporadas
            </Label>
            <Input
              id="totalSeasons"
              type="number"
              value={totalSeasons || ""}
              onChange={(e) => setTotalSeasons(Number.parseInt(e.target.value) || undefined)}
              className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
            />
          </div>
          {status === "completed" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right flex items-center gap-1 text-gray-300">
                <Star className="h-4 w-4 text-cinema-gold" /> Avaliação
              </Label>
              <Select value={rating?.toString() || ""} onValueChange={(value) => setRating(Number.parseInt(value))}>
                <SelectTrigger className="col-span-3 bg-cinema-gray border-cinema-gray text-white">
                  <SelectValue placeholder="Selecione a avaliação" />
                </SelectTrigger>
                <SelectContent className="bg-cinema-dark border-cinema-gray text-white">
                  <SelectItem value="1">1 Estrela</SelectItem>
                  <SelectItem value="2">2 Estrelas</SelectItem>
                  <SelectItem value="3">3 Estrelas</SelectItem>
                  <SelectItem value="4">4 Estrelas</SelectItem>
                  <SelectItem value="5">5 Estrelas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right flex items-center gap-1 text-gray-300">
              <ClipboardList className="h-4 w-4 text-cinema-gold" /> Notas
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-cinema-gray text-gray-300 hover:bg-cinema-gray hover:text-white"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading} className="bg-cinema-gold text-black hover:bg-yellow-600">
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
