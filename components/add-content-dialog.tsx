"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Film, Tv } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { EditContentDialog } from "@/components/edit-content-dialog"
import { SupabaseClient } from "@supabase/supabase-js"

interface AddContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType: "movie" | "series"
  userId: string
  supabase: SupabaseClient
}

export function AddContentDialog({
  open,
  onOpenChange,
  contentType,
  userId,
  supabase,
}: AddContentDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const searchTMDb = async (query: string, type: "movie" | "tv") => {
    if (!query) return []
    
    try {
      setIsSearching(true)
      // Use a relative URL to avoid CORS issues
      const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}&type=${type}`)
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("Erro ao buscar do TMDb:", error)
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar resultados do TMDb. Verifique sua conexão.",
        variant: "destructive",
      })
      return []
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async () => {
    const results = await searchTMDb(searchQuery, contentType === "movie" ? "movie" : "tv")
    setSearchResults(results)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSelectContent = (content: any) => {
    // Transform TMDb data to our format
    const transformedContent = {
      title: content.title || content.name,
      year: new Date(content.release_date || content.first_air_date).getFullYear() || null,
      tmdb_id: content.id,
      poster_path: content.poster_path,
      // Improved default values for these fields
      director: contentType === "movie" ? "Não informado" : "",
      creator: contentType === "series" ? "Não informado" : "",
      genre: "Não informado", // We'll improve this with genre mapping
      status: contentType === "movie" ? "to_watch" : "to_watch",
      rating: null,
      notes: "", // Empty notes field
      // Series specific fields
      current_season: contentType === "series" ? 1 : null,
      current_episode: contentType === "series" ? 1 : null,
      total_seasons: contentType === "series" ? content.number_of_seasons || null : null,
    }
    
    // Fetch additional details to get director, genres, etc.
    fetchContentDetails(content.id, transformedContent);
  }

  const fetchContentDetails = async (tmdbId: number, basicContent: any) => {
    try {
      const endpoint = contentType === "movie" ? "movie" : "tv";
      const response = await fetch(`/api/tmdb/details?id=${tmdbId}&type=${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const details = await response.json();
      
      // Enhanced content with details
      const enhancedContent = {
        ...basicContent,
        // For movies, get director from crew
        director: contentType === "movie" 
          ? details.credits?.crew?.find((person: any) => person.job === "Director")?.name || "Não informado"
          : "",
        // For series, get creator
        creator: contentType === "series"
          ? details.created_by?.map((person: any) => person.name).join(", ") || "Não informado"
          : "",
        // Get genres as comma-separated string
        genre: details.genres?.map((g: any) => g.name).join(", ") || "Não informado",
        // Add overview as notes if available
        notes: details.overview || ""
      };
      
      setSelectedContent(enhancedContent);
      setShowEditDialog(true);
    } catch (error) {
      console.error("Error fetching content details:", error);
      // If details fetch fails, still show dialog with basic info
      setSelectedContent(basicContent);
      setShowEditDialog(true);
    }
  }

  const handleContentSaved = () => {
    // Close both dialogs and reset state
    setShowEditDialog(false)
    onOpenChange(false)
    setSearchQuery("")
    setSearchResults([])
    setSelectedContent(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-cinema-dark border-cinema-gray text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-cinema-gold flex items-center gap-2">
              {contentType === "movie" ? (
                <>
                  <Film className="h-5 w-5" /> Buscar Filme
                </>
              ) : (
                <>
                  <Tv className="h-5 w-5" /> Buscar Série
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="search" className="sr-only">
                  Buscar
                </Label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="search"
                    placeholder={`Buscar ${contentType === "movie" ? "filme" : "série"}...`}
                    className="pl-8 bg-cinema-gray border-cinema-gray text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearch} 
                className={contentType === "movie" ? "bg-cinema-red hover:bg-red-700" : "bg-cinema-gold text-black hover:bg-yellow-600"}
                disabled={isSearching || !searchQuery}
              >
                Buscar
              </Button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {isSearching ? (
                <div className="text-center py-4 text-gray-400">Buscando...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div 
                    key={result.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-cinema-gray cursor-pointer"
                    onClick={() => handleSelectContent(result)}
                  >
                    <div className="flex-shrink-0 h-16 w-12 relative bg-cinema-gray rounded overflow-hidden">
                      {result.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} 
                          alt={result.title || result.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-cinema-gray text-gray-500">
                          <Film className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {result.title || result.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(result.release_date || result.first_air_date).getFullYear() || "Ano desconhecido"}
                      </p>
                    </div>
                  </div>
                ))
              ) : searchQuery && !isSearching ? (
                <div className="text-center py-4 text-gray-400">Nenhum resultado encontrado</div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {selectedContent && (
        <EditContentDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          contentType={contentType}
          content={selectedContent}
          userId={userId}
          supabase={supabase}
          onSaved={handleContentSaved}
          isNew={true}
        />
      )}
    </>
  )
}
