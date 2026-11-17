-- =============================================================================
-- Heróis da Escola — Schema fundação
-- Executar no SQL Editor do Supabase (projeto compartilhado com heroisdaescola-room)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ESCOLAS
-- Cada escola cadastrada na plataforma tem um access_code único
-- que é compartilhado com alunos/professores para liberar o acesso.
-- -----------------------------------------------------------------------------
create table if not exists escolas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  cidade      text,
  estado      text,
  access_code text unique not null,
  status      text not null default 'trial'
                check (status in ('trial', 'ativo', 'inativo')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_escolas_access_code on escolas(access_code);
create index if not exists idx_escolas_status      on escolas(status);

-- -----------------------------------------------------------------------------
-- ACESSOS — módulos liberados por escola
-- Permite ligar/desligar módulos individualmente por escola.
-- Módulos disponíveis: guardioes | room | monitorar | educar | capacitar
-- -----------------------------------------------------------------------------
create table if not exists acessos (
  id         uuid primary key default gen_random_uuid(),
  escola_id  uuid not null references escolas(id) on delete cascade,
  modulo     text not null
               check (modulo in ('guardioes', 'room', 'monitorar', 'educar', 'capacitar')),
  ativo      boolean not null default true,
  created_at timestamptz default now(),
  unique(escola_id, modulo)
);

create index if not exists idx_acessos_escola_modulo on acessos(escola_id, modulo);

-- -----------------------------------------------------------------------------
-- RLS — Row Level Security
-- A chave anon (pública) só pode ler escolas e acessos.
-- Escrita é feita apenas pelo service_role (admin backend).
-- -----------------------------------------------------------------------------
alter table escolas enable row level security;
alter table acessos  enable row level security;

-- Leitura pública — necessário para validar access_code no frontend
create policy "escolas_select_public"
  on escolas for select
  using (true);

create policy "acessos_select_public"
  on acessos for select
  using (true);

-- Escrita apenas via service_role (painel admin ou futuro backend)
create policy "escolas_insert_service"
  on escolas for insert
  with check (auth.role() = 'service_role');

create policy "escolas_update_service"
  on escolas for update
  using (auth.role() = 'service_role');

create policy "acessos_insert_service"
  on acessos for insert
  with check (auth.role() = 'service_role');

create policy "acessos_update_service"
  on acessos for update
  using (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- ESCOLA DE TESTE — para desenvolvimento local
-- Remover ou marcar como inativo antes de ir para produção.
-- -----------------------------------------------------------------------------
insert into escolas (nome, cidade, estado, access_code, status)
values ('Escola Piloto HDA', 'Montes Claros', 'MG', 'HDA2026', 'ativo')
on conflict (access_code) do nothing;

insert into acessos (escola_id, modulo, ativo)
select id, 'guardioes', true from escolas where access_code = 'HDA2026'
on conflict (escola_id, modulo) do nothing;
