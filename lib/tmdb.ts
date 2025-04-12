// Tipos exportados da Server Action
export type { TMDbMovieResult, TMDbSeriesResult } from "@/app/actions/tmdb-actions"

// Função para obter o URL da imagem do poster
export function getPosterUrl(posterPath: string | null, size: "small" | "medium" | "large" = "medium"): string {
  if (!posterPath) return "/images/no-poster.png"

  const sizeMap = {
    small: "w92",
    medium: "w185",
    large: "w500",
  }

  return `https://image.tmdb.org/t/p/${sizeMap[size]}${posterPath}`
}

// Funções utilitárias síncronas para uso no cliente
// Estas são cópias das funções do servidor, mas síncronas para uso no cliente

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

// Função para converter IDs de gênero em nomes (versão síncrona para o cliente)
export function getGenreNames(genreIds: number[]): string {
  return genreIds
    .map((id) => genreMap[id] || "")
    .filter(Boolean)
    .join(", ")
}

// Função para extrair o ano de uma data (versão síncrona para o cliente)
export function extractYear(dateString: string): number | undefined {
  if (!dateString) return undefined
  const year = dateString.split("-")[0]
  return year ? Number.parseInt(year) : undefined
}
