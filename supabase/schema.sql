-- ─────────────────────────────────────────────────────────────────────────────
-- Mi Mes Financiero — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Helper: keep updated_at current on every update ──────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ── 1. monthly_profiles ───────────────────────────────────────────────────────
-- One row per user per month. Stores income and savings goal.

create table if not exists monthly_profiles (
  id                   uuid        primary key default gen_random_uuid(),
  user_id              uuid        not null references auth.users(id) on delete cascade,
  month                text        not null check (month ~ '^\d{4}-\d{2}$'),
  monthly_income       numeric(14,2) not null default 0 check (monthly_income >= 0),
  monthly_savings_goal numeric(14,2) not null default 0 check (monthly_savings_goal >= 0),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  unique (user_id, month)
);

create trigger monthly_profiles_updated_at
  before update on monthly_profiles
  for each row execute function update_updated_at();


-- ── 2. fixed_expenses ─────────────────────────────────────────────────────────
-- Recurring monthly costs the user cannot avoid (rent, utilities, subscriptions).
-- Shared across all months — user creates them once.

create table if not exists fixed_expenses (
  id             uuid          primary key default gen_random_uuid(),
  user_id        uuid          not null references auth.users(id) on delete cascade,
  name           text          not null check (length(trim(name)) > 0),
  monthly_amount numeric(14,2) not null check (monthly_amount > 0),
  created_at     timestamptz   not null default now()
);


-- ── 3. variable_expenses ──────────────────────────────────────────────────────
-- Day-to-day expenses the user registers manually.
-- `month` is generated from `date` so queries can filter cheaply.

create table if not exists variable_expenses (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references auth.users(id) on delete cascade,
  amount      numeric(14,2) not null check (amount > 0),
  category    text          not null check (category in (
                'Mercado', 'Transporte', 'Servicios', 'Vivienda',
                'Comida fuera', 'Deudas', 'Salud', 'Entretenimiento',
                'Gastos hormiga', 'Otros'
              )),
  description text,
  date        date          not null,
  is_hormiga  boolean       not null default false,
  month       text          generated always as (to_char(date, 'YYYY-MM')) stored,
  created_at  timestamptz   not null default now()
);


-- ── 4. liabilities ────────────────────────────────────────────────────────────
-- Debts and obligations.
-- total_amount  → reduces net worth (balance sheet)
-- monthly_payment → reduces monthly variable cash (cash flow)

create table if not exists liabilities (
  id              uuid          primary key default gen_random_uuid(),
  user_id         uuid          not null references auth.users(id) on delete cascade,
  name            text          not null check (length(trim(name)) > 0),
  total_amount    numeric(14,2) not null check (total_amount > 0),
  monthly_payment numeric(14,2) not null check (monthly_payment > 0),
  created_at      timestamptz   not null default now()
);


-- ── 5. assets ─────────────────────────────────────────────────────────────────
-- Things the user owns that have monetary value.

create table if not exists assets (
  id         uuid          primary key default gen_random_uuid(),
  user_id    uuid          not null references auth.users(id) on delete cascade,
  name       text          not null check (length(trim(name)) > 0),
  type       text          not null check (type in (
               'efectivo', 'ahorro', 'inversion', 'inmueble', 'vehiculo', 'otro'
             )),
  value      numeric(14,2) not null check (value > 0),
  created_at timestamptz   not null default now()
);


-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- Every table is fully locked down: users only ever see or touch their own rows.
-- ─────────────────────────────────────────────────────────────────────────────

alter table monthly_profiles  enable row level security;
alter table fixed_expenses    enable row level security;
alter table variable_expenses enable row level security;
alter table liabilities       enable row level security;
alter table assets            enable row level security;

-- One "for all" policy per table is the cleanest approach for user-owned data.
-- `using` guards SELECT/UPDATE/DELETE; `with check` guards INSERT/UPDATE.

create policy "users manage own monthly_profiles"
  on monthly_profiles for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own fixed_expenses"
  on fixed_expenses for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own variable_expenses"
  on variable_expenses for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own liabilities"
  on liabilities for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own assets"
  on assets for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────

-- Composite index on user_id + month for the two tables filtered by month.
create index if not exists idx_monthly_profiles_user_month
  on monthly_profiles (user_id, month);

create index if not exists idx_variable_expenses_user_month
  on variable_expenses (user_id, month);

-- Simple user_id indexes for the rest (no month filtering needed).
create index if not exists idx_fixed_expenses_user
  on fixed_expenses (user_id);

create index if not exists idx_liabilities_user
  on liabilities (user_id);

create index if not exists idx_assets_user
  on assets (user_id);
