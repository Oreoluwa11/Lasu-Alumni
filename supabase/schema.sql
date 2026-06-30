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
  created_at timestamptz default now(),
  unique(student_id, alumni_id)
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade not null,
  alumni_id uuid references profiles(id) on delete cascade not null,
  mentorship_request_id uuid references mentorship_requests(id) on delete set null,
  created_at timestamptz default now(),
  unique(student_id, alumni_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table alumni_profiles enable row level security;
alter table news_articles enable row level security;
alter table mentorship_requests enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Profiles policies
create policy "Authenticated users can read profiles"
on profiles for select to authenticated using (true);

create policy "Users can insert own profile"
on profiles for insert to authenticated
with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update to authenticated
using (auth.uid() = id) with check (auth.uid() = id);

-- Alumni profiles policies
create policy "Authenticated users can read alumni profiles"
on alumni_profiles for select to authenticated using (true);

-- News policies
create policy "Users can read news"
on news_articles for select to authenticated using (true);

-- Mentorship request policies
create policy "Users can create mentorship requests"
on mentorship_requests for insert to authenticated
with check (auth.uid() = student_id);

create policy "Users can read their mentorship requests"
on mentorship_requests for select to authenticated
using (auth.uid() = student_id or auth.uid() = alumni_id);

create policy "Recipients can update request status"
on mentorship_requests for update to authenticated
using (auth.uid() = alumni_id) with check (auth.uid() = alumni_id);

-- Conversations policies
create policy "Participants can view conversations"
on conversations for select to authenticated
using (auth.uid() = student_id or auth.uid() = alumni_id);

create policy "Participants can create conversations"
on conversations for insert to authenticated
with check (auth.uid() = student_id or auth.uid() = alumni_id);

-- Messages policies
create policy "Participants can view messages"
on messages for select to authenticated
using (
  exists (
    select 1 from conversations
    where id = conversation_id
    and (student_id = auth.uid() or alumni_id = auth.uid())
  )
);

create policy "Participants can send messages"
on messages for insert to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from conversations
    where id = conversation_id
    and (student_id = auth.uid() or alumni_id = auth.uid())
  )
);
