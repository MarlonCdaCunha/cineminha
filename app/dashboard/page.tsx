"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clapperboard, Film, Tv, Plus as PlusIcon, 
  LogOut as LogOutIcon, Edit, Star, Search, Popcorn, Trash2
} from "lucide-react"
import { AddContentDialog } from "@/components/add-content-dialog"
import { TMDbInfo } from "@/components/tmdb-info"
import { Input } from "@/components/ui/input"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditContentDialog } from "@/components/edit-content-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Add AlertDialog components to the imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Get the singleton instance
const supabase = getSupabaseClient()

export default function DashboardPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddContent, setShowAddContent] = useState(false)
  const [contentType, setContentType] = useState<"movie" | "series">("movie")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contentTypeFilter, setContentTypeFilter] = useState("all")
  const [envError, setEnvError] = useState(false)
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  
  // Add these new state variables for delete functionality
  const [deleteContent, setDeleteContent] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // Add this filtered content logic
  const filteredContent = content.filter((item) => {
    // Search filter
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    
    // Content type filter
    const matchesType = 
      contentTypeFilter === "all" || 
      (contentTypeFilter === "movie" && item.type === "movie") ||
      (contentTypeFilter === "series" && item.type === "series")
    
    return matchesSearch && matchesStatus && matchesType
  })

  useEffect(() => {
    async function getUser() {
      if (!supabase) {
        setEnvError(true)
        return
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }
      
      setUser(user)
      fetchContent(user.id)
    }
    
    getUser()
  }, [router])
  
  async function fetchContent(userId: string) {
    if (!supabase) return
    
    try {
      setLoading(true)
      
      // Fetch movies
      const { data: movies, error: moviesError } = await supabase
        .from("movies")
        .select("*")
        .eq("user_id", userId)
      
      if (moviesError) throw moviesError
      
      // Fetch series
      const { data: series, error: seriesError } = await supabase
        .from("series")
        .select("*")
        .eq("user_id", userId)
      
      if (seriesError) throw seriesError
      
      // Combine and format data
      const formattedMovies = (movies || []).map(movie => ({
        ...movie,
        type: "movie"
      }))
      
      const formattedSeries = (series || []).map(series => ({
        ...series,
        type: "series"
      }))
      
      setContent([...formattedMovies, ...formattedSeries])
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSignOut = async () => {
    if (!supabase) return
    
    await supabase.auth.signOut()
    router.push("/login")
  }
  
  const handleEditContent = (item: any) => {
    setSelectedContent(item)
    setShowEditDialog(true)
  }
  
  // Add this new function to handle content deletion
  // You could extract these data models and functions to a shared library
  // that both your web and mobile apps could use
  const handleDeleteContent = async () => {
    if (!deleteContent || !supabase) return
    
    try {
      const table = deleteContent.type === "movie" ? "movies" : "series"
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', deleteContent.id)
      
      if (error) throw error
      
      // Refresh content list after deletion
      fetchContent(user.id)
      
      toast({
        title: "Conteúdo excluído",
        description: `${deleteContent.title} foi removido da sua coleção.`,
      })
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o conteúdo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setDeleteContent(null)
    }
  }
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  const handleAddContent = (type: "movie" | "series") => {
    setContentType(type)
    setShowAddContent(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cinema-dark">
        <div className="text-center">
          <Popcorn className="h-12 w-12 text-cinema-red animate-bounce mx-auto mb-4" />
          <div className="text-white text-lg">Carregando...</div>
        </div>
      </div>
    )
  }

  if (envError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cinema-dark">
        <div className="w-full max-w-md rounded-md border border-destructive bg-destructive/10 p-6 text-center text-destructive">
          <h2 className="mb-4 text-xl font-bold">Erro de Configuração</h2>
          <p>
            Variáveis de ambiente ausentes. Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e
            NEXT_PUBLIC_SUPABASE_ANON_KEY estão configuradas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-cinema-dark text-white">
      <header className="border-b border-cinema-gray bg-cinema-dark">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Clapperboard className="h-6 w-6 text-cinema-red" />
            <span className="text-xl text-cinema-gold">CineMinha</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">{user?.email}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white hover:bg-cinema-gray"
            >
              <LogOutIcon className="h-5 w-5" />
              <span className="sr-only">Sair</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <TMDbInfo />

         
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold md:text-3xl text-cinema-gold">Sua Coleção</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar..."
                    className="pl-8 bg-cinema-gray border-cinema-gray text-white placeholder:text-gray-400 w-full sm:w-64"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                
                {/* Add status filter dropdown */}
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[140px] bg-cinema-gray border-cinema-gray text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-cinema-dark border-cinema-gray text-white">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="to_watch">Quero Ver</SelectItem>
                    <SelectItem value="watching">Vendo</SelectItem>
                    <SelectItem value="watched">Já Vi</SelectItem>

                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddContent("movie")}
                  size="sm"
                  className="gap-1 bg-cinema-red hover:bg-red-700"
                >
                  <PlusIcon className="h-4 w-4" /> Adicionar Filme
                </Button>
                <Button
                  onClick={() => handleAddContent("series")}
                  size="sm"
                  className="gap-1 bg-cinema-gold text-black hover:bg-yellow-600"
                >
                  <PlusIcon className="h-4 w-4" /> Adicionar Série
                </Button>
              </div>
            </div>
          </div>

          {/* Content cards section - reducing size by ~40% */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-cinema-dark border border-cinema-gray rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[2/3] w-full">
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cinema-gray">
                      <Film className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={`${
                        item.type === "movie"
                          ? "bg-cinema-red hover:bg-red-700"
                          : "bg-cinema-gold text-black hover:bg-yellow-600"
                      }`}
                    >
                      {item.type === "movie" ? "Filme" : "Série"}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-white truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400">{item.year}</span>
                    <div className="flex items-center">
                      {item.rating ? (
                        <>
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="text-xs text-gray-300">{item.rating}/5</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">Não avaliado</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      {item.type === "movie"
                        ? item.status === "watched"
                          ? "Assistido"
                          : item.status === "watching"
                          ? "Assistindo"
                          : "Para assistir"
                        : item.status === "completed"
                        ? "Completo"
                        : item.status === "watching"
                        ? "Assistindo"
                        : "Para assistir"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-white hover:bg-cinema-gray"
                        onClick={() => handleEditContent(item)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-cinema-gray"
                        onClick={() => {
                          setDeleteContent(item)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {user && (
        <>
          <AddContentDialog
            open={showAddContent}
            onOpenChange={setShowAddContent}
            contentType={contentType}
            userId={user.id}
            supabase={supabase}
          />
          
          {selectedContent && (
            <EditContentDialog
              open={showEditDialog}
              onOpenChange={setShowEditDialog}
              contentType={selectedContent.type}
              content={selectedContent}
              userId={user.id}
              supabase={supabase}
              onSaved={() => {
                setShowEditDialog(false)
                fetchContent(user.id) // Refresh content after saving
              }}
              isNew={false}
            />
          )}
        </>
      )}
      
      {/* Add the delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-cinema-dark border-cinema-gray text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir "{deleteContent?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-cinema-gray text-white hover:bg-gray-700 border-cinema-gray">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteContent}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
