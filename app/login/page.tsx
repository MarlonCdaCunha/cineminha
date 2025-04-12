"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"
import { Clapperboard, UserRound, KeyRound } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Only create the client if we have the required values
  const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

  // Add error state for missing environment variables
  const [envError, setEnvError] = useState<boolean>(false)

  // Check for environment variables when component mounts
  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setEnvError(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if Supabase client is available
    if (!supabase) {
      setError("Cliente Supabase não inicializado. Verifique suas variáveis de ambiente.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Falha ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  if (envError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cinema-pattern px-4">
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
    <div className="flex min-h-screen items-center justify-center bg-cinema-pattern px-4">
      <Card className="w-full max-w-md border-cinema-gray shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Clapperboard className="h-12 w-12 text-cinema-red" />
          </div>
          <CardTitle className="text-2xl font-bold">Entrar no CineMinha</CardTitle>
          <CardDescription>Digite seu e-mail e senha para acessar sua conta</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <UserRound className="h-4 w-4" /> E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-cinema-gray"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-cinema-gold">
                  CineMinha
                </h1>
                <p className="text-sm text-muted-foreground">
                  Faça login para gerenciar sua coleção de filmes e séries
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Senha
                </Label>
                <Link href="/forgot-password" className="text-sm text-cinema-red underline-offset-4 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-cinema-gray"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-cinema-red hover:bg-red-700" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-cinema-red underline-offset-4 hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
