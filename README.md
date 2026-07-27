# Impulse Experience

App de staff para evento menor — login por nome + senha, avisos e chamada. Stack: React + Vite + Supabase.

## Setup

1. `npm install`
2. Copie `.env.local.example` para `.env.local` e preencha com a URL e a chave anon do seu projeto Supabase (Project Settings → API).
3. Rode o SQL abaixo no SQL Editor do Supabase para criar as tabelas.
4. `npm run dev`

## Schema (Supabase SQL Editor)

```sql
create table staff (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  pin text not null unique,
  is_supervisor boolean not null default false,
  ativo boolean not null default true,
  foto_url text,
  genero text check (genero in ('masculino', 'feminino')),
  created_at timestamptz not null default now()
);

create table avisos (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  autor text not null,
  created_at timestamptz not null default now()
);

create table chamada (
  id uuid primary key default gen_random_uuid(),
  staff_nome text not null,
  data date not null,
  status text not null check (status in ('presente', 'ausente')),
  obs text,
  created_at timestamptz not null default now(),
  unique (staff_nome, data)
);

-- RLS: liberado para o app via chave anon (evento fechado, PIN já é a barreira de acesso)
alter table staff enable row level security;
alter table avisos enable row level security;
alter table chamada enable row level security;

create policy "staff select" on staff for select using (true);
create policy "avisos all" on avisos for all using (true) with check (true);
create policy "chamada all" on chamada for all using (true) with check (true);

-- Cadastro publico (tela "Criar conta" do app): so permite criar staff comum,
-- nunca supervisor (isso continua sendo cadastrado manualmente no painel).
create policy "staff insert publico" on staff
  for insert
  with check (is_supervisor = false and ativo = true);

-- Bucket de storage para foto de perfil escolhida no cadastro
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

create policy "avatars leitura publica" on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "avatars upload publico" on storage.objects
  for insert
  with check (bucket_id = 'avatars');
```

O staff pode se cadastrar sozinho pelo app (nome + senha + foto opcional). Contas de **supervisor** continuam sendo cadastradas manualmente no Supabase (Table Editor → `staff`, marcando `is_supervisor = true`) — isso é proposital, pra ninguém virar supervisor sozinho. Login é feito com nome + senha (a senha é o mesmo campo `pin` no banco).

## Deploy

Projeto está preparado para Vercel (framework Vite). Configure as mesmas variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) no dashboard da Vercel antes do deploy.
