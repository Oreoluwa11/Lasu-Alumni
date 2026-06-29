create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('student', 'alumni')),
  faculty text,
  department text,
  graduation_year int,
  company text,
  job_title text,
  location text,
  bio text,
  skills text[] default '{}',
  profile_image text,
  created_at timestamptz default now()
);

create table if not exists alumni_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  occupation text,
  company text,
  industry text,
  available_for_mentorship boolean default true
);

create table if not exists news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  image_url text,
  category text,
  published_at timestamptz default now()
);

create table if not exists mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  alumni_id uuid references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table alumni_profiles enable row level security;
alter table news_articles enable row level security;
alter table mentorship_requests enable row level security;

create policy "Authenticated users can read profiles"
on profiles for select
to authenticated
using (true);

create policy "Users can insert own profile"
on profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Authenticated users can read alumni profiles"
on alumni_profiles for select
to authenticated
using (true);

create policy "Users can read news"
on news_articles for select
to authenticated
using (true);

create policy "Students can create mentorship requests"
on mentorship_requests for insert
to authenticated
with check (auth.uid() = student_id);

create policy "Users can read their mentorship requests"
on mentorship_requests for select
to authenticated
using (auth.uid() = student_id or auth.uid() = alumni_id);
