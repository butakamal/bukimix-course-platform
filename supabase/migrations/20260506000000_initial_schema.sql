-- courses
CREATE TABLE public.courses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  title         text NOT NULL,
  description   text,
  thumbnail_url text,
  sort_order    int  NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- lessons
CREATE TABLE public.lessons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  slug             text NOT NULL,
  title            text NOT NULL,
  description      text,
  youtube_video_id text NOT NULL,
  duration_seconds int,
  sort_order       int  NOT NULL DEFAULT 0,
  is_published     boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, slug)
);

-- profiles
CREATE TABLE public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- progress
CREATE TABLE public.progress (
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- courses: published rows are readable by everyone
CREATE POLICY "courses_select_published"
  ON public.courses FOR SELECT
  USING (is_published = true);

-- lessons: published rows whose parent course is also published
CREATE POLICY "lessons_select_published"
  ON public.lessons FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.is_published = true
    )
  );

-- profiles: owner only
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- progress: owner only
CREATE POLICY "progress_select_own"
  ON public.progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "progress_insert_own"
  ON public.progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_delete_own"
  ON public.progress FOR DELETE
  USING (user_id = auth.uid());
