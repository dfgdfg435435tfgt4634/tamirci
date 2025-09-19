-- service_requests table for beyaz eşya teknik servis
create extension if not exists "pgcrypto";

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  device_type text not null,
  brand text not null,
  issue text not null,
  region text not null,
  phone text,
  source text not null default 'chatbot',
  whatsapp_sent boolean not null default false,
  created_at timestamptz not null default now(),
  notes text
);