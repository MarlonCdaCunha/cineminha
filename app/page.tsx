import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Film, Tv, Star, Clapperboard } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-cinema-dark border-b border-cinema-gray">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Clapperboard className="h-6 w-6 text-cinema-red" />
            <span className="text-xl text-white">CineMinha</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-cinema-gold hover:bg-cinema-gray">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-cinema-red hover:bg-red-700 text-white">Cadastrar</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-hero-pattern bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white cinema-text-shadow">
                  Acompanhe seus <span className="text-cinema-red">Filmes</span> e{" "}
                  <span className="text-cinema-gold">Séries</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Mantenha o controle do que você quer assistir, o que já assistiu e o que achou.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg" className="gap-2 bg-cinema-red hover:bg-red-700 text-white">
                    Começar Agora <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-cinema-dark text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-cinema-red/20 p-4">
                  <Film className="h-8 w-8 text-cinema-red" />
                </div>
                <h3 className="text-xl font-bold text-cinema-gold">Acompanhe Filmes</h3>
                <p className="text-gray-400">Mantenha uma lista de filmes que deseja assistir e avalie-os depois.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-cinema-gold/20 p-4">
                  <Tv className="h-8 w-8 text-cinema-gold" />
                </div>
                <h3 className="text-xl font-bold text-cinema-gold">Acompanhe Séries</h3>
                <p className="text-gray-400">Acompanhe as séries que está assistindo e quais episódios já viu.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-cinema-red/20 p-4">
                  <Star className="h-8 w-8 text-cinema-red" />
                </div>
                <h3 className="text-xl font-bold text-cinema-gold">Avalie e Comente</h3>
                <p className="text-gray-400">
                  Dê sua opinião sobre o que assistiu e mantenha suas impressões registradas.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-cinema-pattern bg-repeat">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-cinema-red sm:text-4xl">
                Sua Coleção de Entretenimento
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                Organize, acompanhe e descubra novos filmes e séries. Tudo em um só lugar, de forma simples e intuitiva.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Link href="/signup">
                    <Button className="bg-cinema-red hover:bg-red-700 text-white">Criar Conta Gratuita</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-cinema-gray py-6 md:py-0 bg-cinema-dark text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <div className="flex items-center gap-2">
            <Clapperboard className="h-5 w-5 text-cinema-red" />
            <p className="text-sm">&copy; {new Date().getFullYear()} CineMinha. Todos os direitos reservados. Desenvolvido por Marlon Cunha</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-400 hover:text-cinema-gold">
              Termos
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-cinema-gold">
              Privacidade
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-cinema-gold">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
