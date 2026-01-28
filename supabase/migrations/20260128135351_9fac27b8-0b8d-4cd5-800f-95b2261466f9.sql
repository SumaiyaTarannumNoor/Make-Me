-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  portfolio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create experience level enum
CREATE TYPE public.experience_level AS ENUM ('student', 'fresher', 'one_to_three', 'three_to_five', 'senior');

-- Create resume templates table
CREATE TABLE public.resume_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  experience_level experience_level NOT NULL,
  preview_image_url TEXT,
  layout_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on templates (public read)
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are publicly viewable"
ON public.resume_templates FOR SELECT
USING (is_active = true);

-- Create resumes table for user resumes
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.resume_templates(id),
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  personal_info JSONB DEFAULT '{}',
  summary TEXT,
  experience JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  pdf_url TEXT,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on resumes
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Resumes policies
CREATE POLICY "Users can view their own resumes"
ON public.resumes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
ON public.resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
ON public.resumes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
ON public.resumes FOR DELETE
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default resume templates
INSERT INTO public.resume_templates (name, description, experience_level, layout_config) VALUES
('Student Fresh Start', 'Perfect for students with limited work experience. Highlights education, projects, and skills.', 'student', '{"color": "from-icy-blue-400 to-sky-blue-500", "layout": "education-first", "sections": ["education", "projects", "skills", "certifications"]}'),
('Career Starter', 'Designed for fresh graduates and those entering the workforce. Emphasizes potential and learning ability.', 'fresher', '{"color": "from-pastel-petal-400 to-baby-pink-500", "layout": "balanced", "sections": ["summary", "education", "skills", "projects"]}'),
('Professional Growth', 'For professionals with 1-3 years of experience. Balances work history with skills development.', 'one_to_three', '{"color": "from-thistle-400 to-thistle-500", "layout": "experience-first", "sections": ["summary", "experience", "skills", "education"]}'),
('Senior Professional', 'For experienced professionals with 3-5 years. Showcases career progression and achievements.', 'three_to_five', '{"color": "from-sky-blue-400 to-icy-blue-500", "layout": "achievement-focused", "sections": ["summary", "experience", "skills", "certifications"]}'),
('Non-Working Professional', 'For career changers or those re-entering the workforce. Highlights transferable skills.', 'student', '{"color": "from-baby-pink-300 to-pastel-petal-400", "layout": "skills-first", "sections": ["summary", "skills", "projects", "certifications"]}');

-- Create storage bucket for resume PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policies for resume PDFs
CREATE POLICY "Users can upload their own resume PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resume PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resume PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resume PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);