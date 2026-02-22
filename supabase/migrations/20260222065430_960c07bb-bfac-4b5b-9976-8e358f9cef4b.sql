
-- Create role enum
CREATE TYPE public.user_role AS ENUM ('candidate', 'recruiter');

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'candidate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Candidate profiles
CREATE TABLE public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  location TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

-- Company profiles
CREATE TABLE public.company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  website TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- Jobs
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  salary_range TEXT DEFAULT '',
  location TEXT DEFAULT '',
  skills_required TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Swipes
CREATE TYPE public.swipe_target_type AS ENUM ('job', 'candidate');
CREATE TYPE public.swipe_direction AS ENUM ('left', 'right');

CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type swipe_target_type NOT NULL,
  target_id UUID NOT NULL,
  direction swipe_direction NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(swiper_id, target_type, target_id)
);
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

-- Matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(candidate_id, recruiter_id, job_id)
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'candidate')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- Profiles: users can read all, update own
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Candidate profiles: readable by all authenticated, editable by owner
CREATE POLICY "Authenticated can read candidate profiles" ON public.candidate_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner can insert candidate profile" ON public.candidate_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owner can update candidate profile" ON public.candidate_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Company profiles: readable by all authenticated, editable by owner
CREATE POLICY "Authenticated can read company profiles" ON public.company_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner can insert company profile" ON public.company_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owner can update company profile" ON public.company_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Jobs: readable by all authenticated, CRUD by recruiter owner
CREATE POLICY "Authenticated can read jobs" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Recruiter can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (recruiter_id = auth.uid());
CREATE POLICY "Recruiter can update own jobs" ON public.jobs FOR UPDATE TO authenticated USING (recruiter_id = auth.uid());
CREATE POLICY "Recruiter can delete own jobs" ON public.jobs FOR DELETE TO authenticated USING (recruiter_id = auth.uid());

-- Swipes: owner can CRUD, no reading others' swipes
CREATE POLICY "User can read own swipes" ON public.swipes FOR SELECT TO authenticated USING (swiper_id = auth.uid());
CREATE POLICY "User can insert swipes" ON public.swipes FOR INSERT TO authenticated WITH CHECK (swiper_id = auth.uid());

-- Matches: participants can read
CREATE POLICY "Participants can read matches" ON public.matches FOR SELECT TO authenticated USING (candidate_id = auth.uid() OR recruiter_id = auth.uid());
CREATE POLICY "System can insert matches" ON public.matches FOR INSERT TO authenticated WITH CHECK (candidate_id = auth.uid() OR recruiter_id = auth.uid());

-- Messages: match participants can read and send
CREATE POLICY "Match participants can read messages" ON public.messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.matches WHERE matches.id = match_id AND (matches.candidate_id = auth.uid() OR matches.recruiter_id = auth.uid())));
CREATE POLICY "Match participants can send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.matches WHERE matches.id = match_id AND (matches.candidate_id = auth.uid() OR matches.recruiter_id = auth.uid())));
