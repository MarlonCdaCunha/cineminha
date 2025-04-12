"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"
import { Film, Tv, Calendar, User2, Star, ArrowLeft, Edit, Trash } from "lucide-react"
import Image from "next/image"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default function ContentDetailsPage({ params }: { params: { type: string; id: string } }) {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    async function fetchContent() {
      if (!supabase) return
      
      const { type, id } = params
      const table = type === "movie" ? "movies" : "series"
      
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single()
        
      if (error) {
        console.error("Error fetching content:", error)
        return
      }
      
      setContent(data)
      setLoading(false)
    }
    
    fetchContent()
  }, [params])
  
  if (loading) {
    return <div className="p-8 text-center text-white">Carregando...</div>
  }
  
  if (!content) {
    return <div className="p-8 text-center text-white">Conteúdo não encontrado</div>
  }
  
  const isMovie = params.type === "movie"
  const posterUrl = content.poster_path
    ? `https://image.tmdb.org/t/p/w500${content.poster_path}`
    : "/images/no-poster.png"
    
  return (
    <div className="container p-4 md:p-6 text-white">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-4 text-gray-300 hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={posterUrl}
            alt={content.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-cinema-gold">{content.title}</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 text-red-500">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <User2 className="h-4 w-4 text-cinema-red" />
              {isMovie ? "Diretor:" : "Criador:"} <span className="text-white">{isMovie ? content.director : content.creator}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="h-4 w-4 text-cinema-gold" />
              Ano: <span className="text-white">{content.year}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              {isMovie ? <Film className="h-4 w-4 text-cinema-red" /> : <Tv className="h-4 w-4 text-cinema-gold" />}
              Gênero: <span className="text-white">{content.genre}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <Star className="h-4 w-4 text-yellow-500" />
              Avaliação: <span className="text-white">{content.rating ? `${content.rating}/5` : "Não avaliado"}</span>
            </div>
          </div>
          
          {!isMovie && (
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-cinema-gray rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-300">Temporada atual</div>
                <div className="text-xl font-bold text-cinema-gold">{content.current_season || "N/A"}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300">Episódio atual</div>
                <div className="text-xl font-bold text-cinema-gold">{content.current_episode || "N/A"}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300">Total de temporadas</div>
                <div className="text-xl font-bold text-cinema-gold">{content.total_seasons || "N/A"}</div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-cinema-gold">Status</h2>
            <div className="px-4 py-2 bg-cinema-gray inline-block rounded-full text-white">
              {isMovie ? (
                content.status === "watched" ? "Assistido" :
                content.status === "watching" ? "Assistindo" : "Para assistir"
              ) : (
                content.status === "completed" ? "Completo" :
                content.status === "watching" ? "Assistindo" : "Para assistir"
              )}
            </div>
          </div>
          
          {content.notes && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-cinema-gold">Notas</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{content.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}