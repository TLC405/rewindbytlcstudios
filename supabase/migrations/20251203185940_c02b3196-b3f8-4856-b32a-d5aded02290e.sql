-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  credits INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scenarios table for legendary transformation scenarios
CREATE TABLE public.scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  era TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'star',
  gradient TEXT NOT NULL DEFAULT 'from-amber-500/20 to-amber-900/20',
  accent TEXT NOT NULL DEFAULT 'text-amber-400',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transformations table for user's AI transformations
CREATE TABLE public.transformations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE SET NULL,
  original_image_url TEXT NOT NULL,
  transformed_image_url TEXT,
  prompt_used TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audio_tracks table for music player
CREATE TABLE public.audio_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  era TEXT,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Scenarios policies (public read)
CREATE POLICY "Anyone can view active scenarios" ON public.scenarios
  FOR SELECT USING (is_active = true);

-- Transformations policies
CREATE POLICY "Users can view their own transformations" ON public.transformations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transformations" ON public.transformations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transformations" ON public.transformations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transformations" ON public.transformations
  FOR DELETE USING (auth.uid() = user_id);

-- Audio tracks policies (public read)
CREATE POLICY "Anyone can view active audio tracks" ON public.audio_tracks
  FOR SELECT USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transformations_updated_at
  BEFORE UPDATE ON public.transformations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default legendary scenarios
INSERT INTO public.scenarios (title, era, description, prompt_template, icon, gradient, accent) VALUES
('Oscar Night, 1994', '90s', 'Accept the Academy Award on the legendary Shrine Auditorium stage', 'Reference Person accepting an Academy Award at the 1994 Oscars ceremony at the Shrine Auditorium. The person is wearing an elegant formal attire appropriate for the era, standing at the podium holding the golden Oscar statuette. Dramatic stage lighting with warm spotlights. The audience in the background is applauding. Cinematic film grain, 90s photography style.', 'trophy', 'from-amber-500/20 to-amber-900/20', 'text-amber-400'),
('Backstage with Legends', '90s', 'Studio session at Death Row Records with Dr. Dre & Snoop', 'Reference Person in a 1990s recording studio session at Death Row Records. The person is wearing iconic 90s hip-hop fashion - baggy clothes, gold chains, snapback cap. Professional recording equipment, mixing console, and studio monitors visible. Moody atmospheric lighting with purple and blue tones. Other musicians in the background. Authentic 90s photography aesthetic.', 'music', 'from-purple-500/20 to-purple-900/20', 'text-purple-400'),
('Roman Colosseum', 'Ancient', 'Stand victorious in the arena as a legendary gladiator', 'Reference Person as a victorious gladiator in the Roman Colosseum. The person is wearing authentic Roman gladiator armor - bronze helmet with crest, leather armor, arm guards, and sandals. Standing triumphantly in the sandy arena with the massive Colosseum architecture in the background. Dramatic sunset lighting casting golden rays. Crowd cheering from the stands. Epic cinematic composition, oil painting style.', 'crown', 'from-red-500/20 to-red-900/20', 'text-red-400'),
('Disco Inferno', '70s', 'Own the dance floor at Studio 54 in its golden era', 'Reference Person dancing at Studio 54 nightclub in 1977. The person is wearing iconic 70s disco fashion - sequined outfit, platform shoes, big collar shirt. Surrounded by disco balls, colorful lights, and glamorous partygoers. The famous Studio 54 interior with its theatrical lighting. Dynamic pose on the illuminated dance floor. Grainy 70s photograph aesthetic, vibrant colors.', 'sparkles', 'from-pink-500/20 to-pink-900/20', 'text-pink-400'),
('Moon Landing', '60s', 'Take one small step for mankind on the lunar surface', 'Reference Person as an astronaut on the Moon during the Apollo era. The person is wearing an authentic NASA spacesuit with American flag patch. Standing on the lunar surface with footprints in the moon dust. Earth visible in the black sky. The lunar module in the background. Dramatic lighting from the sun. Historical NASA photography style, slight color grading.', 'star', 'from-blue-500/20 to-blue-900/20', 'text-blue-400'),
('Cyberpunk 2077', 'Future', 'Navigate the neon-lit streets of Night City', 'Reference Person in a cyberpunk future city. The person is wearing futuristic clothing with neon accents, cybernetic implants visible, tactical gear. Standing in rain-soaked streets with holographic advertisements, flying vehicles overhead, massive skyscrapers with LED panels. Neon pink, cyan, and purple lighting reflecting off wet surfaces. Blade Runner aesthetic, cinematic composition.', 'zap', 'from-cyan-500/20 to-cyan-900/20', 'text-cyan-400');

-- Create storage bucket for transformation images
INSERT INTO storage.buckets (id, name, public) VALUES ('transformations', 'transformations', true);

-- Storage policies for transformations bucket
CREATE POLICY "Anyone can view transformation images" ON storage.objects
  FOR SELECT USING (bucket_id = 'transformations');

CREATE POLICY "Authenticated users can upload transformation images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'transformations' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own transformation images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'transformations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own transformation images" ON storage.objects
  FOR DELETE USING (bucket_id = 'transformations' AND auth.uid()::text = (storage.foldername(name))[1]);