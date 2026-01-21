-- Migration: create user_content and profiles tables with RLS and policies.
-- Run these in your Supabase SQL editor or via supabase migrations.

-- Profiles table to store minimal user info
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Public content table shared to Explore
create table if not exists user_content (
  id bigserial primary key,
  user_id uuid references auth.users,
  title text not null,
  type text not null, -- textbook | flashcard | note | video
  author text,
  creator text,
  body text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable row level security
alter table profiles enable row level security;
alter table user_content enable row level security;

-- Allow users to insert their own profile rows
create policy "profiles_insert_own" on profiles
  for insert using (auth.role() = 'authenticated') with check (auth.uid() = id);

create policy "profiles_select_public" on profiles
  for select using (true);

-- user_content policies:
-- Allow anyone to read public shared content
create policy "user_content_select_public" on user_content
  for select using (true);

-- Allow authenticated users to insert content (their own user_id)
create policy "user_content_insert_authenticated" on user_content
  for insert using (auth.role() = 'authenticated') with check (user_id = auth.uid());

-- Allow users to update/delete only their own content
create policy "user_content_modify_own" on user_content
  for update, delete using (user_id = auth.uid()) with check (user_id = auth.uid());
