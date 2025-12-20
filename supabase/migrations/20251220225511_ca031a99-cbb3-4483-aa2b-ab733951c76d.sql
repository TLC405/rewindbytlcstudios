-- Create device_fingerprints table for advanced anti-abuse
CREATE TABLE public.device_fingerprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint_hash text NOT NULL,
  canvas_hash text,
  webgl_hash text,
  audio_hash text,
  screen_hash text,
  timezone text,
  language text,
  platform text,
  device_memory integer,
  cpu_cores integer,
  transformation_count integer NOT NULL DEFAULT 0,
  first_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  is_blocked boolean NOT NULL DEFAULT false,
  block_reason text,
  UNIQUE(fingerprint_hash)
);

-- Enable RLS
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;

-- RLS policies for device_fingerprints
CREATE POLICY "Anyone can insert fingerprints"
ON public.device_fingerprints
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read fingerprints"
ON public.device_fingerprints
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update fingerprints"
ON public.device_fingerprints
FOR UPDATE
USING (true);

-- Admins can delete fingerprints
CREATE POLICY "Admins can delete fingerprints"
ON public.device_fingerprints
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster lookups
CREATE INDEX idx_device_fingerprints_hash ON public.device_fingerprints(fingerprint_hash);
CREATE INDEX idx_device_fingerprints_canvas ON public.device_fingerprints(canvas_hash);
CREATE INDEX idx_device_fingerprints_webgl ON public.device_fingerprints(webgl_hash);