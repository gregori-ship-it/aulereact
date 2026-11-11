-- Caderneta da Claudia — schema para Supabase (Postgres)
-- Autenticacao propria: tabela usuarios com senha em hash (bcrypt),
-- sem depender do Supabase Auth. Execute no editor SQL do Supabase.
-- Atencao: este script apaga e recria as tabelas abaixo.

create extension if not exists pgcrypto;

drop table if exists public.lancamentos;
drop table if exists public.categorias;
drop table if exists public.contas;
drop table if exists public.usuarios;

create table public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  criado_em timestamptz not null default now()
);

create table public.contas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.usuarios (id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('corrente', 'cartao', 'especie', 'poupanca')),
  saldo_inicial numeric(10, 2) not null,
  data_abertura date not null,
  unique (user_id, nome),
  unique (id, user_id)
);

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.usuarios (id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('entrada', 'saida')),
  cor_hex text not null check (cor_hex ~ '^#[0-9A-Fa-f]{6}$'),
  unique (user_id, nome),
  unique (id, user_id)
);

create table public.lancamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.usuarios (id) on delete cascade,
  conta_id uuid not null,
  categoria_id uuid not null,
  tipo text not null check (tipo in ('entrada', 'saida')),
  valor numeric(10, 2) not null check (valor > 0),
  data_lancamento date not null,
  descricao text,
  criado_em timestamptz not null default now(),
  foreign key (conta_id, user_id) references public.contas (id, user_id) on delete restrict,
  foreign key (categoria_id, user_id) references public.categorias (id, user_id) on delete restrict
);

create index lancamentos_user_id_data_idx
  on public.lancamentos (user_id, data_lancamento desc);
create index lancamentos_user_id_categoria_idx
  on public.lancamentos (user_id, categoria_id);

-- RLS fica ligado, mas sem nenhuma policy: isso bloqueia qualquer acesso
-- via chave anon/publica. O app acessa com a service_role key (que ignora
-- RLS) e filtra por usuario no proprio codigo (ver lib/auth/sessao.ts).
alter table public.usuarios enable row level security;
alter table public.contas enable row level security;
alter table public.categorias enable row level security;
alter table public.lancamentos enable row level security;
