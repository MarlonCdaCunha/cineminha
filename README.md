# CineMinha - Aplicativo de Gerenciamento de Filmes e Séries

CineMinha é um aplicativo web para gerenciar sua coleção de filmes e séries. Acompanhe o que você já assistiu, o que está assistindo e o que deseja assistir no futuro.

## Funcionalidades

- Autenticação de usuários (login/cadastro)
- Adicionar, editar e excluir filmes e séries
- Busca automática de informações via API do TMDb
- Acompanhamento de progresso de séries (temporadas e episódios)
- Avaliação de filmes e séries assistidos
- Interface temática de cinema

## Configuração

### Variáveis de Ambiente

O aplicativo requer as seguintes variáveis de ambiente:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
TMDB_API_KEY=sua_chave_api_do_tmdb
\`\`\`

### Configuração do Supabase

1. Crie um projeto no Supabase
2. Configure a autenticação por e-mail
3. Execute o script SQL fornecido para criar as tabelas e políticas de segurança

## Tecnologias Utilizadas

- Next.js
- React
- Supabase (autenticação e banco de dados)
- Tailwind CSS
- shadcn/ui
- API do The Movie Database (TMDb)

## Como Usar

1. Crie uma conta ou faça login
2. Navegue entre as abas de Filmes e Séries
3. Use o botão "Adicionar Filme" ou "Adicionar Série" para incluir novos itens
4. Digite o nome do filme ou série para buscar automaticamente informações
5. Selecione um resultado da busca ou preencha manualmente os detalhes
6. Atualize o status e progresso conforme você assiste
7. Avalie os filmes e séries que você já assistiu

## Desenvolvimento

### Estrutura do Projeto

- `/app` - Páginas e rotas da aplicação
- `/components` - Componentes React reutilizáveis
- `/lib` - Funções utilitárias e serviços
- `/public` - Arquivos estáticos

### Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT.
