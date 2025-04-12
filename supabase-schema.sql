-- Tabela de filmes
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  director TEXT NOT NULL,
  year INTEGER NOT NULL,
  genre TEXT NOT NULL,
  status TEXT NOT NULL,
  rating INTEGER,
  notes TEXT,
  tmdb_id INTEGER,
  poster_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Tabela de séries
CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  creator TEXT NOT NULL,
  year INTEGER NOT NULL,
  genre TEXT NOT NULL,
  status TEXT NOT NULL,
  current_season INTEGER,
  current_episode INTEGER,
  total_seasons INTEGER,
  rating INTEGER,
  notes TEXT,
  tmdb_id INTEGER,
  poster_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Políticas de segurança para filmes
CREATE POLICY "Usuários podem ver seus próprios filmes" ON movies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios filmes" ON movies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios filmes" ON movies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios filmes" ON movies
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de segurança para séries
CREATE POLICY "Usuários podem ver suas próprias séries" ON series
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias séries" ON series
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias séries" ON series
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias séries" ON series
  FOR DELETE USING (auth.uid() = user_id);
