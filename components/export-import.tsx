"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Download, Upload, AlertCircle } from "lucide-react"
import { SupabaseClient } from "@supabase/supabase-js"

interface ExportImportProps {
  userId: string
  supabase: SupabaseClient
}

export function ExportImport({ userId, supabase }: ExportImportProps) {
  const [importing, setImporting] = useState(false)
  
  const handleExport = async () => {
    try {
      // Fetch all user's movies
      const { data: movies, error: moviesError } = await supabase
        .from("movies")
        .select("*")
        .eq("user_id", userId)
        
      // Fetch all user's series
      const { data: series, error: seriesError } = await supabase
        .from("series")
        .select("*")
        .eq("user_id", userId)
        
      if (moviesError || seriesError) {
        throw new Error(moviesError?.message || seriesError?.message)
      }
      
      // Create export data
      const exportData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        userId,
        movies: movies || [],
        series: series || []
      }
      
      // Convert to JSON and create download link
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
      
      const exportFileDefaultName = `cineminha-export-${new Date().toISOString().slice(0, 10)}.json`
      
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
      
      toast({
        title: "Exportação concluída",
        description: "Seus dados foram exportados com sucesso.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar seus dados. Tente novamente.",
        variant: "destructive",
      })
    }
  }
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setImporting(true)
    
    try {
      const fileContent = await file.text()
      const importData = JSON.parse(fileContent)
      
      // Validate import data
      if (!importData.movies || !importData.series || !importData.version) {
        throw new Error("Formato de arquivo inválido")
      }
      
      // Process movies
      if (importData.movies.length > 0) {
        // Remove ids to avoid conflicts and ensure user_id matches current user
        const processedMovies = importData.movies.map(({ id, created_at, ...movie }: any) => ({
          ...movie,
          user_id: userId
        }))
        
        const { error: moviesError } = await supabase.from("movies").insert(processedMovies)
        if (moviesError) throw new Error(`Erro ao importar filmes: ${moviesError.message}`)
      }
      
      // Process series
      if (importData.series.length > 0) {
        // Remove ids to avoid conflicts and ensure user_id matches current user
        const processedSeries = importData.series.map(({ id, created_at, ...series }: any) => ({
          ...series,
          user_id: userId
        }))
        
        const { error: seriesError } = await supabase.from("series").insert(processedSeries)
        if (seriesError) throw new Error(`Erro ao importar séries: ${seriesError.message}`)
      }
      
      toast({
        title: "Importação concluída",
        description: `Importados ${importData.movies.length} filmes e ${importData.series.length} séries.`,
      })
      
      // Reload the page to show the imported data
      window.location.reload()
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Não foi possível importar seus dados.",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
      // Reset the file input
      event.target.value = ""
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-cinema-dark border-cinema-gray text-white">
          <Download className="h-4 w-4" /> Exportar/Importar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-cinema-dark border-cinema-gray text-white">
        <DialogHeader>
          <DialogTitle className="text-cinema-gold">Exportar/Importar Coleção</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Exportar Dados</h3>
            <p className="text-sm text-gray-400">
              Exporte sua coleção completa para um arquivo JSON. Útil para backup ou transferência.
            </p>
            <Button onClick={handleExport} className="w-full gap-2 bg-cinema-red hover:bg-red-700">
              <Download className="h-4 w-4" /> Exportar Coleção
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Importar Dados</h3>
            <p className="text-sm text-gray-400">
              Importe uma coleção a partir de um arquivo JSON exportado anteriormente.
            </p>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <p className="text-xs text-yellow-500">
                Atenção: A importação adiciona novos itens e não substitui os existentes.
              </p>
            </div>
            <div className="relative">
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button 
                className="w-full gap-2 bg-cinema-gold text-black hover:bg-yellow-600" 
                disabled={importing}
              >
                <Upload className="h-4 w-4" /> {importing ? "Importando..." : "Selecionar Arquivo"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}