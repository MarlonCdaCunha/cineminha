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
import { Clapperboard, KeyRound, Mail } from "lucide-react"

export default function SignupPage() {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if Supabase client is available
    if (!supabase) {
      setError("Cliente Supabase não inicializado. Verifique suas variáveis de ambiente.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "Falha ao criar conta")
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
          <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
          <CardDescription>Digite seu e-mail e senha para criar sua conta</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> E-mail
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
              <Label htmlFor="password" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-cinema-gray"
              />
              <p className="text-xs text-muted-foreground">A senha deve ter pelo menos 6 caracteres</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-cinema-red hover:bg-red-700" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-cinema-red underline-offset-4 hover:underline">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
