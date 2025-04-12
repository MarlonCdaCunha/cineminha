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
import { Film, Calendar, User2, Tag, Star, ClipboardList, Pencil } from "lucide-react"

interface Movie {
  id: string
  title: string
  director: string
  year: number
  genre: string
  status: "watched" | "watching" | "to_watch"
  rating?: number
  notes?: string
}

interface EditMovieDialogProps {
  movie: Movie
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
  supabase: SupabaseClient
}

export function EditMovieDialog({ movie, open, onOpenChange, onSave, supabase }: EditMovieDialogProps) {
  const [title, setTitle] = useState(movie.title)
  const [director, setDirector] = useState(movie.director)
  const [year, setYear] = useState(movie.year)
  const [genre, setGenre] = useState(movie.genre)
  const [status, setStatus] = useState(movie.status)
  const [rating, setRating] = useState<number | undefined>(movie.rating)
  const [notes, setNotes] = useState(movie.notes || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!title || !director || !year || !genre) {
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
        .from("movies")
        .update({
          title,
          director,
          year,
          genre,
          status,
          rating,
          notes,
        })
        .eq("id", movie.id)

      if (error) throw error

      toast({
        title: "Filme atualizado",
        description: "Seu filme foi atualizado com sucesso",
      })

      onSave()
    } catch (error) {
      console.error("Erro ao atualizar filme:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar filme. Por favor, tente novamente.",
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
            <Pencil className="h-5 w-5 text-cinema-red" /> Editar Filme
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right flex items-center gap-1 text-gray-300">
              <Film className="h-4 w-4 text-cinema-red" /> Título
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
            <Label htmlFor="director" className="text-right flex items-center gap-1 text-gray-300">
              <User2 className="h-4 w-4 text-cinema-red" /> Diretor
            </Label>
            <Input
              id="director"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              className="col-span-3 bg-cinema-gray border-cinema-gray text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right flex items-center gap-1 text-gray-300">
              <Calendar className="h-4 w-4 text-cinema-red" /> Ano
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
              <Tag className="h-4 w-4 text-cinema-red" /> Gênero
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
              <ClipboardList className="h-4 w-4 text-cinema-red" /> Status
            </Label>
            <Select value={status} onValueChange={(value) => setStatus(value as "watched" | "watching" | "to_watch")}>
              <SelectTrigger className="col-span-3 bg-cinema-gray border-cinema-gray text-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-cinema-dark border-cinema-gray text-white">
                <SelectItem value="to_watch">Para assistir</SelectItem>
                <SelectItem value="watching">Assistindo</SelectItem>
                <SelectItem value="watched">Assistido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status === "watched" && (
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
              <ClipboardList className="h-4 w-4 text-cinema-red" /> Notas
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
            <Button onClick={handleSave} disabled={loading} className="bg-cinema-red hover:bg-red-700">
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
