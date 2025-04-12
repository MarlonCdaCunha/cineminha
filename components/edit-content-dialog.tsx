"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Film, Tv, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { SupabaseClient } from "@supabase/supabase-js"

interface EditContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType: "movie" | "series"
  content: any
  userId: string
  supabase: SupabaseClient
  onSaved: () => void
  isNew?: boolean
}

export function EditContentDialog({
  open,
  onOpenChange,
  contentType,
  content,
  userId,
  supabase,
  onSaved,
  isNew = false,
}: EditContentDialogProps) {
  const [formData, setFormData] = useState(content)
  const [isSaving, setIsSaving] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === "" ? null : parseInt(value, 10)
    setFormData((prev: any) => ({ ...prev, [name]: numValue }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const table = contentType === "movie" ? "movies" : "series"
      
      // Create a copy of the form data
      const dataToSave = { ...formData, user_id: userId }
      
      // Remove fields that don't belong to the respective table
      if (contentType === "movie") {
        // Remove series-specific fields
        delete dataToSave.creator
        delete dataToSave.current_season
        delete dataToSave.current_episode
        delete dataToSave.total_seasons
      } else {
        // Remove movie-specific fields
        delete dataToSave.director
      }
      
      // Remove the 'type' field as it's not in the database schema
      delete dataToSave.type
      
      // For existing content, use update instead of insert
      if (!isNew) {
        const { error } = await supabase
          .from(table)
          .update(dataToSave)
          .eq('id', dataToSave.id)
        
        if (error) throw error
        
        toast({
          title: `${contentType === "movie" ? "Filme" : "Série"} atualizado(a)`,
          description: `${formData.title} foi atualizado(a) com sucesso.`,
        })
      } else {
        const { error } = await supabase.from(table).insert(dataToSave)
        
        if (error) throw error
        
        toast({
          title: `${contentType === "movie" ? "Filme" : "Série"} adicionado(a)`,
          description: `${formData.title} foi adicionado(a) à sua coleção.`,
        })
      }
      
      onSaved()
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o conteúdo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const posterUrl = formData.poster_path
    ? `https://image.tmdb.org/t/p/w500${formData.poster_path}`
    : "/images/no-poster.png"
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cinema-dark border-cinema-gray text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-cinema-gold flex items-center gap-2">
            {contentType === "movie" ? (
              <>
                <Film className="h-5 w-5" /> {isNew ? "Adicionar" : "Editar"} Filme
              </>
            ) : (
              <>
                <Tv className="h-5 w-5" /> {isNew ? "Adicionar" : "Editar"} Série
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <div className="aspect-[2/3] relative rounded-md overflow-hidden bg-cinema-gray">
              <img 
                src={posterUrl} 
                alt={formData.title} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-cinema-gray border-cinema-gray text-white"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor={contentType === "movie" ? "director" : "creator"}>
                  {contentType === "movie" ? "Diretor" : "Criador"}
                </Label>
                <Input
                  id={contentType === "movie" ? "director" : "creator"}
                  name={contentType === "movie" ? "director" : "creator"}
                  value={contentType === "movie" ? formData.director : formData.creator}
                  onChange={handleChange}
                  className="bg-cinema-gray border-cinema-gray text-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year || ""}
                    onChange={handleNumberChange}
                    className="bg-cinema-gray border-cinema-gray text-white"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="genre">Gênero</Label>
                  <Input
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="bg-cinema-gray border-cinema-gray text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    name="status" 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="bg-cinema-gray border-cinema-gray text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-cinema-dark border-cinema-gray text-white">
                      {contentType === "movie" ? (
                        <>
                          <SelectItem value="watched">Assistido</SelectItem>
                          <SelectItem value="watching">Assistindo</SelectItem>
                          <SelectItem value="to_watch">Para assistir</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="completed">Completo</SelectItem>
                          <SelectItem value="watching">Assistindo</SelectItem>
                          <SelectItem value="to_watch">Para assistir</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="rating">Avaliação</Label>
                  <Select 
                    name="rating" 
                    value={formData.rating?.toString() || "no-rating"} 
                    onValueChange={(value) => handleSelectChange("rating", value === "no-rating" ? null : parseInt(value, 10))}
                  >
                    <SelectTrigger className="bg-cinema-gray border-cinema-gray text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-cinema-dark border-cinema-gray text-white">
                      <SelectItem value="no-rating">Sem avaliação</SelectItem>
                      <SelectItem value="1">1 estrela</SelectItem>
                      <SelectItem value="2">2 estrelas</SelectItem>
                      <SelectItem value="3">3 estrelas</SelectItem>
                      <SelectItem value="4">4 estrelas</SelectItem>
                      <SelectItem value="5">5 estrelas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {contentType === "series" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="current_season">Temporada Atual</Label>
                <Input
                  id="current_season"
                  name="current_season"
                  type="number"
                  min="1"
                  value={formData.current_season || ""}
                  onChange={handleNumberChange}
                  className="bg-cinema-gray border-cinema-gray text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="current_episode">Episódio Atual</Label>
                <Input
                  id="current_episode"
                  name="current_episode"
                  type="number"
                  min="1"
                  value={formData.current_episode || ""}
                  onChange={handleNumberChange}
                  className="bg-cinema-gray border-cinema-gray text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="total_seasons">Total de Temporadas</Label>
                <Input
                  id="total_seasons"
                  name="total_seasons"
                  type="number"
                  min="1"
                  value={formData.total_seasons || ""}
                  onChange={handleNumberChange}
                  className="bg-cinema-gray border-cinema-gray text-white"
                />
              </div>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              className="bg-cinema-gray border-cinema-gray text-white min-h-[100px]"
              placeholder="Adicione suas notas ou comentários aqui..."
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-cinema-gray text-white hover:bg-cinema-gray"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className={contentType === "movie" ? "bg-cinema-red hover:bg-red-700" : "bg-cinema-gold text-black hover:bg-yellow-600"}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}