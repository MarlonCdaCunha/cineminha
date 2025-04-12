"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, ArrowUpDown } from "lucide-react"

interface FilterBarProps {
  onFilterChange: (filter: string) => void
  onSortChange: (sort: string) => void
}

export function FilterBar({ onFilterChange, onSortChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-1">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select onValueChange={onFilterChange} defaultValue="all">
          <SelectTrigger className="w-[120px] bg-cinema-gray border-cinema-gray text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-cinema-dark border-cinema-gray text-white">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="watched">Assistidos</SelectItem>
            <SelectItem value="watching">Assistindo</SelectItem>
            <SelectItem value="to_watch">Para assistir</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-1">
        <ArrowUpDown className="h-4 w-4 text-gray-400" />
        <Select onValueChange={onSortChange} defaultValue="title_asc">
          <SelectTrigger className="w-[120px] bg-cinema-gray border-cinema-gray text-white">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent className="bg-cinema-dark border-cinema-gray text-white">
            <SelectItem value="title_asc">Título (A-Z)</SelectItem>
            <SelectItem value="title_desc">Título (Z-A)</SelectItem>
            <SelectItem value="year_desc">Ano (Recente)</SelectItem>
            <SelectItem value="year_asc">Ano (Antigo)</SelectItem>
            <SelectItem value="rating_desc">Avaliação (Alta)</SelectItem>
            <SelectItem value="rating_asc">Avaliação (Baixa)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}