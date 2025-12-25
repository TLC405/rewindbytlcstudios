-- Drop all public policies from ip_usage table
DROP POLICY IF EXISTS "Anyone can read IP usage" ON public.ip_usage;
DROP POLICY IF EXISTS "Anyone can insert IP usage" ON public.ip_usage;
DROP POLICY IF EXISTS "Anyone can update IP usage" ON public.ip_usage;

-- Drop all public policies from device_fingerprints table
DROP POLICY IF EXISTS "Anyone can read fingerprints" ON public.device_fingerprints;
DROP POLICY IF EXISTS "Anyone can insert fingerprints" ON public.device_fingerprints;
DROP POLICY IF EXISTS "Anyone can update fingerprints" ON public.device_fingerprints;

-- Note: These tables will now only be accessible via service role (Edge Functions)
-- This is intentional - rate limiting should be handled server-side only