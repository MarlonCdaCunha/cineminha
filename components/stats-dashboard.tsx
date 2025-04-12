"use client"

import { useState, useEffect } from "react"
import { SupabaseClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, PieChart, Activity, Clock } from "lucide-react"

interface StatsDashboardProps {
  userId: string
  supabase: SupabaseClient
}

export function StatsDashboard({ userId, supabase }: StatsDashboardProps) {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    watchedMovies: 0,
    watchingSeries: 0,
    topGenre: "",
    avgRating: 0,
  })
  
  useEffect(() => {
    async function fetchStats() {
      // Fetch movie count
      const { data: movies, error: moviesError } = await supabase
        .from("movies")
        .select("status, genre, rating")
        .eq("user_id", userId)
      
      // Fetch series count
      const { data: series, error: seriesError } = await supabase
        .from("series")
        .select("status, genre, rating")
        .eq("user_id", userId)
        
      if (moviesError || seriesError) {
        console.error("Error fetching stats:", moviesError || seriesError)
        return
      }
      
      // Calculate stats
      const totalMovies = movies?.length || 0
      const totalSeries = series?.length || 0
      const watchedMovies = movies?.filter(m => m.status === "watched").length || 0
      const watchingSeries = series?.filter(s => s.status === "watching").length || 0
      
      // Calculate average rating
      const allRatings = [...(movies || []), ...(series || [])].map(item => item.rating).filter(Boolean)
      const avgRating = allRatings.length 
        ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
        : 0
      
      // Find top genre
      const allGenres = [...(movies || []), ...(series || [])].map(item => item.genre)
      const genreCounts = {}
      allGenres.forEach(genre => {
        if (genre) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1
        }
      })
      
      const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ""
      
      setStats({
        totalMovies,
        totalSeries,
        watchedMovies,
        watchingSeries,
        topGenre,
        avgRating: parseFloat(avgRating.toFixed(1)),
      })
    }
    
    fetchStats()
  }, [userId, supabase])
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-cinema-dark border-cinema-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart className="h-4 w-4 text-cinema-red" /> Total de Títulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cinema-gold">{stats.totalMovies + stats.totalSeries}</div>
          <p className="text-xs text-gray-400">
            {stats.totalMovies} filmes, {stats.totalSeries} séries
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-cinema-dark border-cinema-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PieChart className="h-4 w-4 text-cinema-gold" /> Gênero Favorito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cinema-gold">{stats.topGenre || "N/A"}</div>
          <p className="text-xs text-gray-400">Baseado na sua coleção</p>
        </CardContent>
      </Card>
      
      <Card className="bg-cinema-dark border-cinema-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-cinema-red" /> Avaliação Média
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cinema-gold">{stats.avgRating}/5</div>
          <p className="text-xs text-gray-400">Baseado nas suas avaliações</p>
        </CardContent>
      </Card>
      
      <Card className="bg-cinema-dark border-cinema-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-cinema-gold" /> Status Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cinema-gold">{stats.watchingSeries}</div>
          <p className="text-xs text-gray-400">Séries em andamento</p>
        </CardContent>
      </Card>
    </div>
  )
}