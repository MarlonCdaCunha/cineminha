"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { checkTMDbApiKey } from "@/app/actions/tmdb-actions"

export function TMDbInfo() {
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    const checkApiKey = async () => {
      const isAvailable = await checkTMDbApiKey()
      setApiKeyAvailable(isAvailable)
    }

    checkApiKey()
  }, [])

  if (apiKeyAvailable === null) {
    return null // Loading state
  }

  if (!apiKeyAvailable) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API Key do TMDb não encontrada</AlertTitle>
        <AlertDescription>
          Adicione a variável de ambiente TMDB_API_KEY para habilitar a busca automática de filmes e séries.
        </AlertDescription>
      </Alert>
    )
  }

  return 
}
