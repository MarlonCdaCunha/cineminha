"use server"

// Tipos para os resultados da API do TMDb
export interface TMDbMovieResult {
  id: number
  title: string
  original_title: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  genre_ids: number[]
}

export interface TMDbSeriesResult {
  id: number
  name: string
  original_name: string
  first_air_date: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  genre_ids: number[]
}

export interface TMDbSearchResponse {
  page: number
  results: (TMDbMovieResult | TMDbSeriesResult)[]
  total_results: number
  total_pages: number
}

// Mapeamento de IDs de gêneros do TMDb para nomes
const genreMap: Record<number, string> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  10770: "Cinema TV",
  53: "Thriller",
  10752: "Guerra",
  37: "Faroeste",
  10759: "Ação & Aventura",
  10762: "Kids",
  10763: "Notícias",
  10764: "Reality",
  10765: "Sci-Fi & Fantasia",
  10766: "Novela",
  10767: "Talk",
  10768: "Guerra & Política",
}

// Função para buscar filmes na API do TMDb
export async function searchMovies(query: string): Promise<TMDbMovieResult[]> {
  if (!query.trim()) return []

  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    console.error("API key do TMDb não encontrada")
    return []
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`)
    }

    const data: TMDbSearchResponse = await response.json()
    return data.results as TMDbMovieResult[]
  } catch (error) {
    console.error("Erro ao buscar filmes:", error)
    return []
  }
}

// Função para buscar séries na API do TMDb
export async function searchSeries(query: string): Promise<TMDbSeriesResult[]> {
  if (!query.trim()) return []

  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    console.error("API key do TMDb não encontrada")
    return []
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`)
    }

    const data: TMDbSearchResponse = await response.json()
    return data.results as TMDbSeriesResult[]
  } catch (error) {
    console.error("Erro ao buscar séries:", error)
    return []
  }
}

// Função para obter detalhes de um filme específico
export async function getMovieDetails(movieId: number): Promise<any> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    console.error("API key do TMDb não encontrada")
    return null
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR&append_to_response=credits`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar detalhes do filme:", error)
    return null
  }
}

// Função para obter detalhes de uma série específica
export async function getSeriesDetails(seriesId: number): Promise<any> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    console.error("API key do TMDb não encontrada")
    return null
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=pt-BR&append_to_response=credits`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar detalhes da série:", error)
    return null
  }
}

// Função para verificar se a API do TMDb está configurada
export async function checkTMDbApiKey(): Promise<boolean> {
  const apiKey = process.env.TMDB_API_KEY
  return !!apiKey
}

// Função para converter IDs de gênero em nomes - agora assíncrona
export async function getGenreNames(genreIds: number[]): Promise<string> {
  return genreIds
    .map((id) => genreMap[id] || "")
    .filter(Boolean)
    .join(", ")
}

// Função para extrair o ano de uma data - agora assíncrona
export async function extractYear(dateString: string): Promise<number | undefined> {
  if (!dateString) return undefined
  const year = dateString.split("-")[0]
  return year ? Number.parseInt(year) : undefined
}
