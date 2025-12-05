-- ==============================================================================
-- SHINRA LABS - DEMO DATA SETUP (FOR DEMO CREDENTIALS)
-- ==============================================================================
-- WORKS WITH: admin@shinra.com / demo123 and cloud@avalanche.net / demo123
-- ==============================================================================

-- STEP 1: First, sign up these 2 accounts in your app:
-- 1. Go to: http://localhost:5173/signup
-- 2. Create: admin@shinra.com / demo123 (Company)
-- 3. Create: cloud@avalanche.net / demo123 (Freelancer)

-- STEP 2: Then run this script to add demo data automatically

-- ==============================================================================
-- AUTO-DETECT AND SEED DEMO DATA
-- ==============================================================================

DO $$
DECLARE
    company_uuid UUID;
    freelancer_uuid UUID;
BEGIN
    -- Find the demo users by email
    SELECT id INTO company_uuid FROM auth.users WHERE email = 'admin@shinra.com';
    SELECT id INTO freelancer_uuid FROM auth.users WHERE email = 'cloud@avalanche.net';

    -- If demo users don't exist, show error with instructions
    IF company_uuid IS NULL OR freelancer_uuid IS NULL THEN
        RAISE EXCEPTION E'\n❌ DEMO USERS NOT FOUND!\n\nPlease create these accounts first:\n1. http://localhost:5173/signup\n2. Email: admin@shinra.com, Password: demo123, Role: Company\n3. Email: cloud@avalanche.net, Password: demo123, Role: Freelancer\n\nThen run this script again.';
    END IF;

    RAISE NOTICE '✅ Found Company User: % (Email: admin@shinra.com)', company_uuid;
    RAISE NOTICE '✅ Found Freelancer User: % (Email: cloud@avalanche.net)', freelancer_uuid;

    -- ==============================================================================
    -- INSERT DEMO USERS META
    -- ==============================================================================
    INSERT INTO public.users_meta (id, role, name, skills, experience, rating, completed_tasks)
    VALUES 
        (company_uuid, 'company', 'Shinra Electric Power Company', NULL, NULL, 0.0, 0),
        (freelancer_uuid, 'freelancer', 'Cloud Strife', 'Bounding Box, Segmentation, Classification', 'Expert', 4.88, 124)
    ON CONFLICT (id) DO UPDATE 
    SET 
        name = EXCLUDED.name,
        skills = EXCLUDED.skills,
        experience = EXCLUDED.experience,
        rating = EXCLUDED.rating,
        completed_tasks = EXCLUDED.completed_tasks;

    RAISE NOTICE '✅ Demo user profiles created';

    -- ==============================================================================
    -- INSERT DEMO TASKS (4 tasks at different stages)
    -- ==============================================================================
    INSERT INTO public.tasks (id, company_id, title, description, task_type, difficulty, price, status, created_at)
    VALUES
        ('a1111111-1111-1111-1111-111111111111', company_uuid, 
         'Traffic Sign Detection Dataset', 
         'Annotate 500 images with bounding boxes around all visible traffic signs. Include sign type classification.',
         'image', 'medium', 450, 'open', NOW() - INTERVAL '2 days'),
         
        ('a2222222-2222-2222-2222-222222222222', company_uuid,
         'Medical Conversation Sentiment Analysis',
         'Classify sentiment in 1000 doctor-patient conversation transcripts.',
         'text', 'easy', 250, 'open', NOW() - INTERVAL '1 day'),
         
        ('a3333333-3333-3333-3333-333333333333', company_uuid,
         'E-Commerce Product Categorization',
         'Categorize 2000 product listings into appropriate categories.',
         'text', 'easy', 180, 'submitted', NOW() - INTERVAL '3 hours'),
         
        ('a4444444-4444-4444-4444-444444444444', company_uuid,
         'Autonomous Driving Scene Segmentation',
         'Pixel-level segmentation of urban driving scenes.',
         'image', 'hard', 1200, 'approved', NOW() - INTERVAL '5 days')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '✅ 4 demo tasks created (2 open, 1 submitted, 1 approved)';

    -- ==============================================================================
    -- INSERT DEMO SUBMISSIONS
    -- ==============================================================================
    INSERT INTO public.submissions (id, task_id, freelancer_id, submission_data, auto_score, status, created_at)
    VALUES
        ('e1111111-1111-1111-1111-111111111111', 
         'a3333333-3333-3333-3333-333333333333', 
         freelancer_uuid,
         '{"annotations": [{"product_id": "P001", "category": "Electronics > Smartphones"}], "total_processed": 2000}',
         0.94, 'pending', NOW() - INTERVAL '2 hours'),
         
        ('e2222222-2222-2222-2222-222222222222', 
         'a4444444-4444-4444-4444-444444444444',
         freelancer_uuid, 
         '{"format": "COCO_JSON", "classes": ["road", "vehicle", "pedestrian", "building", "sky"], "image_count": 350}',
         0.96, 'approved', NOW() - INTERVAL '5 days')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '✅ 2 demo submissions created';

    -- ==============================================================================
    -- INSERT DEMO DATASETS (Marketplace)
    -- ==============================================================================
    INSERT INTO public.datasets (id, title, description, price, data_type, source_task_id, created_at)
    VALUES
        ('f1111111-1111-1111-1111-111111111111',
         'Urban Driving Segmentation Dataset (Verified)',
         'Professional quality pixel-level segmentation dataset for autonomous vehicles. 350 high-resolution frames verified by Shinra QA.',
         3000, 'image', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '4 days'),
         
        ('f2222222-2222-2222-2222-222222222222',
         'Indian Traffic Signs 2024 (Premium)',
         'Comprehensive collection of 800+ Indian traffic signs with regional variants. Bounding box + classification labels.',
         2500, 'image', NULL, NOW() - INTERVAL '10 days'),
         
        ('f3333333-3333-3333-3333-333333333333',
         'Medical NLP Sentiment Corpus',
         'Annotated healthcare conversations with multi-class sentiment labels. 5000+ verified samples.',
         4200, 'text', NULL, NOW() - INTERVAL '15 days')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '✅ 3 demo datasets created for marketplace';

    -- ==============================================================================
    -- INSERT DEMO NOTIFICATIONS
    -- ==============================================================================
    INSERT INTO public.notifications (user_id, message, is_read, created_at)
    VALUES
        (freelancer_uuid, 
         'PAYMENT RELEASED: ₹1200 for ''Autonomous Driving Scene Segmentation'' has been credited to your wallet.',
         false, NOW() - INTERVAL '4 days'),
         
        (freelancer_uuid,
         'New high-value task available: Traffic Sign Detection Dataset (₹450)',
         false, NOW() - INTERVAL '1 day'),
         
        (company_uuid,
         'SUBMISSION RECEIVED: E-Commerce Product Categorization is ready for review.',
         false, NOW() - INTERVAL '2 hours')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ 3 demo notifications created';

    RAISE NOTICE E'\n========================================';
    RAISE NOTICE '✅ DEMO DATA SETUP COMPLETE!';
    RAISE NOTICE E'========================================\n';
    RAISE NOTICE 'You can now login with:';
    RAISE NOTICE '  • Company: admin@shinra.com / demo123';
    RAISE NOTICE '  • Freelancer: cloud@avalanche.net / demo123';
    RAISE NOTICE E'\n';

END $$;
