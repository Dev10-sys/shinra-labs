-- ==============================================================================
-- EMERGENCY FIX - CREATE users_meta FOR EXISTING AUTH USERS
-- ==============================================================================
-- Run this if you already signed up but getting "profile not found" error
-- This adds users_meta entries for ALL existing auth.users
-- ==============================================================================

-- Check existing users first
SELECT id, email, created_at FROM auth.users;

-- Now create users_meta for ALL auth users
INSERT INTO public.users_meta (id, role, name, skills, experience, rating, completed_tasks)
SELECT 
    id,
    'company' as role,  -- Default to company, you can change manually later
    COALESCE(raw_user_meta_data->>'name', email) as name,
    NULL as skills,
    NULL as experience,
    0.0 as rating,
    0 as completed_tasks
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Update specific demo users to correct roles
UPDATE public.users_meta SET role = 'company', name = 'Shinra Electric Power Company' 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@shinra.com');

UPDATE public.users_meta SET role = 'freelancer', name = 'Cloud Strife', skills = 'Bounding Box, Segmentation', experience = 'Expert', rating = 4.88, completed_tasks = 124
WHERE id IN (SELECT id FROM auth.users WHERE email = 'cloud@avalanche.net');

-- Verify
SELECT um.id, um.role, um.name, au.email 
FROM public.users_meta um
JOIN auth.users au ON um.id = au.id;

SELECT '✅ FIXED! All auth users now have profiles. Try logging in again.' as status;
