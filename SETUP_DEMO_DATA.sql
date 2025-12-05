-- ==============================================================================
-- SHINRA LABS - COMPLETE DEMO DATA SETUP
-- ==============================================================================
-- Run this AFTER running the main schema to populate demo users and tasks
-- This ensures your platform ALWAYS has data for demonstrations
-- ==============================================================================

-- 1. CREATE DEMO USERS (Matching the hardcoded credentials in LoginPage.jsx)
-- These IDs match exactly what the frontend expects

INSERT INTO public.users_meta (id, role, name, email, skills, experience, rating, completed_tasks, earnings, gst_id, industry, website)
VALUES 
    -- Company User
    ('550e8400-e29b-41d4-a716-446655440000', 'company', 'Shinra Electric Power Company', 'admin@shinra.com', 
     NULL, NULL, 0, 0, 0, 'GSTIN29AABCS1234F1Z5', 'AI & Machine Learning', 'https://shinra-labs.ai'),
    
    -- Freelancer User  
    ('660e8400-e29b-41d4-a716-446655440000', 'freelancer', 'Cloud Strife', 'cloud@avalanche.net', 
     ARRAY['Bounding Box', 'Segmentation', 'Classification'], 'Expert', 4.88, 124, 12500, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE 
SET 
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    skills = EXCLUDED.skills,
    experience = EXCLUDED.experience,
    rating = EXCLUDED.rating,
    completed_tasks = EXCLUDED.completed_tasks,
    earnings = EXCLUDED.earnings;

-- 2. CREATE DEMO TASKS (Posted by Company)
INSERT INTO public.tasks (id, company_id, title, description, task_type, difficulty, price, status, created_at)
VALUES
    ('a1111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 
     'Traffic Sign Detection Dataset', 
     'Annotate 500 images with bounding boxes around all visible traffic signs. Include sign type classification.',
     'image', 'medium', 450, 'open', NOW() - INTERVAL '2 days'),
     
    ('a2222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440000',
     'Medical Conversation Sentiment Analysis',
     'Classify sentiment in 1000 doctor-patient conversation transcripts. Categories: Positive, Neutral, Negative, Urgent.',
     'text', 'easy', 250, 'open', NOW() - INTERVAL '1 day'),
     
    ('a3333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440000',
     'E-Commerce Product Categorization',
     'Categorize 2000 product listings into appropriate hierarchical categories.',
     'text', 'easy', 180, 'submitted', NOW() - INTERVAL '3 hours'),
     
    ('a4444444-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440000',
     'Autonomous Driving Scene Segmentation',
     'Pixel-level segmentation of urban driving scenes. Label: Road, Vehicle, Pedestrian, Building, Sky.',
     'image', 'hard', 1200, 'approved', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- 3. CREATE DEMO SUBMISSIONS (Freelancer Work History)
INSERT INTO public.submissions (id, task_id, freelancer_id, submission_data, auto_score, status, created_at)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 
     '660e8400-e29b-41d4-a716-446655440000',
     '{"annotations": [{"product_id": "P001", "category": "Electronics > Smartphones"}], "total_processed": 2000}',
     0.94, 'pending', NOW() - INTERVAL '2 hours'),
     
    ('s2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444',
     '660e8400-e29b-41d4-a716-446655440000', 
     '{"format": "COCO_JSON", "classes": ["road", "vehicle", "pedestrian", "building", "sky"], "image_count": 350}',
     0.96, 'approved', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- 4. CREATE MARKETPLACE DATASETS (Auto-generated from approved tasks)
INSERT INTO public.datasets (id, title, description, price, data_type, source_task_id, created_at)
VALUES
    ('d1111111-1111-1111-1111-111111111111',
     'Urban Driving Segmentation Dataset (Verified)',
     'Professional quality pixel-level segmentation dataset for autonomous vehicles. 350 high-resolution frames with 5-class annotations verified by Shinra QA.',
     3000, 'image', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '4 days'),
     
    ('d2222222-2222-2222-2222-222222222222',
     'Indian Traffic Signs 2024 (Premium)',
     'Comprehensive collection of 800+ Indian traffic signs with regional variants. Bounding box + classification labels.',
     2500, 'image', NULL, NOW() - INTERVAL '10 days'),
     
    ('d3333333-3333-3333-3333-333333333333',
     'Medical NLP Sentiment Corpus',
     'Annotated healthcare conversations with multi-class sentiment labels. 5000+ samples.',
     4200, 'text', NULL, NOW() - INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;

-- 5. CREATE NOTIFICATIONS
INSERT INTO public.notifications (user_id, message, is_read, created_at)
VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 
     'PAYMENT RELEASED: ₹1200 for ''Autonomous Driving Scene Segmentation'' has been credited to your wallet.',
     false, NOW() - INTERVAL '4 days'),
     
    ('660e8400-e29b-41d4-a716-446655440000',
     'New high-value task available: Traffic Sign Detection Dataset (₹450)',
     false, NOW() - INTERVAL '1 day'),
     
    ('550e8400-e29b-41d4-a716-446655440000',
     'SUBMISSION RECEIVED: E-Commerce Product Categorization is ready for review.',
     false, NOW() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- Final Confirmation
SELECT '✅ DEMO DATA SEEDED - Platform Ready for Demonstration' as status;
