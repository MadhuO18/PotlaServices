create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;
revoke all on public.contact_inquiries from anon, authenticated;
