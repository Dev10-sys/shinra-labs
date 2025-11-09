-- ============================================
-- SHINRA DATABASE SCHEMA - SUPABASE OPTIMIZED
-- ============================================

-- DROP EXISTING TABLES (if they exist) - START FRESH
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS datasets CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS leaderboard CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('freelancer', 'company')),
  balance NUMERIC(12, 2) DEFAULT 0 CHECK (balance >= 0),
  total_earned NUMERIC(12, 2) DEFAULT 0 CHECK (total_earned >= 0),
  rating NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  tasks_completed INTEGER DEFAULT 0 CHECK (tasks_completed >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('text', 'image', 'audio', 'video')),
  payout NUMERIC(10, 2) NOT NULL CHECK (payout > 0),
  estimated_time_minutes INTEGER CHECK (estimated_time_minutes > 0),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datasets Table
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data_type TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  downloads INTEGER DEFAULT 0 CHECK (downloads >= 0),
  rating NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions Table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  ai_confidence NUMERIC(5, 4) DEFAULT 0 CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  shinra_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, freelancer_id) -- Prevent duplicate submissions
);

-- Purchases Table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  amount_paid NUMERIC(10, 2) NOT NULL CHECK (amount_paid >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earning', 'purchase', 'withdrawal', 'refund')),
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_rating ON users(rating DESC) WHERE role = 'freelancer';

-- Tasks indexes
CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Datasets indexes
CREATE INDEX idx_datasets_creator_id ON datasets(creator_id);
CREATE INDEX idx_datasets_data_type ON datasets(data_type);
CREATE INDEX idx_datasets_price ON datasets(price);
CREATE INDEX idx_datasets_rating ON datasets(rating DESC);

-- Submissions indexes
CREATE INDEX idx_submissions_task_id ON submissions(task_id);
CREATE INDEX idx_submissions_freelancer_id ON submissions(freelancer_id);
CREATE INDEX idx_submissions_verified ON submissions(verified);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);

-- Purchases indexes
CREATE INDEX idx_purchases_buyer_id ON purchases(buyer_id);
CREATE INDEX idx_purchases_dataset_id ON purchases(dataset_id);
CREATE INDEX idx_purchases_created_at ON purchases(created_at DESC);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type) WHERE type = 'earning';

-- ============================================
-- CREATE VIEWS
-- ============================================

-- Leaderboard View
CREATE VIEW leaderboard AS
SELECT 
  u.id,
  u.name,
  u.email,
  COALESCE(SUM(t.amount), 0) as total_earnings,
  u.tasks_completed,
  u.rating,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(t.amount), 0) DESC, u.rating DESC) as rank
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id AND t.type = 'earning'
WHERE u.role = 'freelancer'
GROUP BY u.id, u.name, u.email, u.tasks_completed, u.rating;

-- ============================================
-- CREATE FUNCTIONS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_datasets_updated_at BEFORE UPDATE ON datasets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users: Users can read all, update only their own
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Tasks: Everyone can read, companies can create/update their own
CREATE POLICY "Everyone can view tasks" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "Companies can create tasks" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'company' AND id = company_id)
  );

CREATE POLICY "Companies can update own tasks" ON tasks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'company' AND id = company_id)
  );

-- Datasets: Everyone can read, creators can manage their own
CREATE POLICY "Everyone can view datasets" ON datasets
  FOR SELECT USING (true);

CREATE POLICY "Creators can manage own datasets" ON datasets
  FOR ALL USING (auth.uid() = creator_id);

-- Submissions: Freelancers can create, everyone can read
CREATE POLICY "Everyone can view submissions" ON submissions
  FOR SELECT USING (true);

CREATE POLICY "Freelancers can create submissions" ON submissions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'freelancer' AND id = freelancer_id)
  );

CREATE POLICY "Freelancers can update own submissions" ON submissions
  FOR UPDATE USING (auth.uid() = freelancer_id);

-- Purchases: Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create purchases" ON purchases
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Transactions: Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions" ON transactions
  FOR INSERT WITH CHECK (true);

-- ============================================
-- INSERT DEMO DATA
-- ============================================

-- INSERT TEST USERS (Companies + Freelancers)
INSERT INTO users (email, name, role, balance, total_earned, rating, tasks_completed) VALUES
('company@scalai.com', 'Scale AI India', 'company', 500000, 0, 5.0, 0),
('company@flipkart.com', 'Flipkart AI Lab', 'company', 250000, 0, 4.9, 0),
('arjun@freelancer.com', 'Arjun Kumar', 'freelancer', 12450, 125000, 4.9, 450),
('priya@freelancer.com', 'Priya Singh', 'freelancer', 8750, 87500, 4.8, 320),
('raj@freelancer.com', 'Raj Patel', 'freelancer', 6200, 62000, 4.7, 280),
('neha@freelancer.com', 'Neha Sharma', 'freelancer', 5100, 51000, 4.6, 240),
('vikram@freelancer.com', 'Vikram Desai', 'freelancer', 4300, 43000, 4.5, 200),
('sunita@freelancer.com', 'Sunita Verma', 'freelancer', 3200, 32000, 4.4, 160),
('amit@freelancer.com', 'Amit Gupta', 'freelancer', 2100, 21000, 4.3, 120),
('rohit@freelancer.com', 'Rohit Singh', 'freelancer', 1500, 15000, 4.2, 90);

-- INSERT TASKS
INSERT INTO tasks (company_id, title, description, task_type, payout, estimated_time_minutes, status) VALUES
((SELECT id FROM users WHERE email='company@scalai.com'), 
 'Label 500 Hindi Sentiment Tweets', 
 'Classify tweets as Positive/Negative/Neutral. Look for emotional indicators. Must be 95% accurate.', 
 'text', 50, 20, 'open'),
((SELECT id FROM users WHERE email='company@scalai.com'), 
 'Draw Bounding Boxes on Faces', 
 'Draw boxes around human faces in images. Each image has 2-5 faces. Quality check: boxes must be tight.', 
 'image', 100, 25, 'open'),
((SELECT id FROM users WHERE email='company@scalai.com'), 
 'Transcribe Hindi Audio Clips', 
 'Convert 3-minute Hindi audio files to text. Include timestamps. Must be verbatim.', 
 'audio', 150, 30, 'in_progress'),
((SELECT id FROM users WHERE email='company@scalai.com'), 
 'Categorize Product Images', 
 'Sort e-commerce images into categories: Electronics, Fashion, Home, Food, etc.', 
 'image', 40, 15, 'open'),
((SELECT id FROM users WHERE email='company@scalai.com'), 
 'Verify Product Descriptions', 
 'Check if descriptions match images. Mark correct/incorrect/partially_correct.', 
 'text', 60, 18, 'open'),
((SELECT id FROM users WHERE email='company@flipkart.com'), 
 'Label Customer Reviews Sentiment', 
 'Hindi reviews need classification: Very Positive, Positive, Neutral, Negative, Very Negative.', 
 'text', 45, 12, 'open'),
((SELECT id FROM users WHERE email='company@flipkart.com'), 
 'Annotate Food Images', 
 'Tag ingredients visible in food product images. Multiple tags per image allowed.', 
 'image', 80, 20, 'open'),
((SELECT id FROM users WHERE email='company@flipkart.com'), 
 'Review Quality Check', 
 'Verify if reviews are authentic/spam/bot. Mark appropriately with reasons.', 
 'text', 70, 22, 'in_progress'),
((SELECT id FROM users WHERE email='company@flipkart.com'), 
 'Video Frame Labeling', 
 'Extract 5 key frames from product videos and label what they show.', 
 'video', 120, 35, 'open');

-- INSERT DEMO DATASETS
INSERT INTO datasets (creator_id, title, description, data_type, price, downloads, rating) VALUES
((SELECT id FROM users WHERE email='arjun@freelancer.com'), 
 '50K Hindi Movie Reviews - Sentiment Labeled', 
 'Comprehensive dataset of Hindi movie reviews with sentiment labels (positive/negative/neutral). Quality verified. Perfect for Hindi NLP models.', 
 'text', 15000, 47, 4.9),
((SELECT id FROM users WHERE email='arjun@freelancer.com'), 
 '100K English-Hindi Translation Pairs', 
 'High-quality parallel corpus of English sentences with Hindi translations. Verified by native speakers. Ideal for translation models.', 
 'text', 25000, 23, 4.8),
((SELECT id FROM users WHERE email='priya@freelancer.com'), 
 '10K Indian Faces - Annotated', 
 'Diverse Indian face images with bounding boxes and facial landmarks. Good for face detection/recognition models. High diversity in ages, expressions.', 
 'image', 8000, 34, 4.9),
((SELECT id FROM users WHERE email='priya@freelancer.com'), 
 '5K Indian Food Images - Categorized', 
 'High-quality food images with 20+ cuisine categories. Includes dish names, ingredients. Perfect for food recognition AI.', 
 'image', 12000, 28, 4.8),
((SELECT id FROM users WHERE email='raj@freelancer.com'), 
 '3K Hindi Conversational Dialog Pairs', 
 'Natural conversational exchanges in Hindi. Paired with English translations. Good for chatbot training.', 
 'text', 5000, 15, 4.7),
((SELECT id FROM users WHERE email='raj@freelancer.com'), 
 '2K Indian Street Scene Videos - Labeled', 
 'Street-level videos from major Indian cities with scene descriptions and object labels.', 
 'video', 18000, 8, 4.7),
((SELECT id FROM users WHERE email='neha@freelancer.com'), 
 '25K Product Titles - NER Annotated', 
 'E-commerce product titles with named entity recognition (brand, category, features). Great for entity extraction.', 
 'text', 4500, 22, 4.6),
((SELECT id FROM users WHERE email='sunita@freelancer.com'), 
 '1K Hindi Audio Transcripts - Timestamped', 
 'Professional audio transcriptions with timestamps. 20+ hours total. Includes background noise variations.', 
 'audio', 9000, 5, 4.4);

-- INSERT TRANSACTIONS
INSERT INTO transactions (user_id, type, amount, description) VALUES
((SELECT id FROM users WHERE email='arjun@freelancer.com'), 'earning', 50000, 'Completed 1000 task submissions'),
((SELECT id FROM users WHERE email='arjun@freelancer.com'), 'earning', 75000, 'Dataset sales royalties - Hindi Reviews'),
((SELECT id FROM users WHERE email='priya@freelancer.com'), 'earning', 45000, 'Completed 800 task submissions'),
((SELECT id FROM users WHERE email='priya@freelancer.com'), 'earning', 42500, 'Dataset sales royalties - Food Images + Faces'),
((SELECT id FROM users WHERE email='raj@freelancer.com'), 'earning', 40000, 'Completed 700 task submissions'),
((SELECT id FROM users WHERE email='raj@freelancer.com'), 'earning', 22000, 'Dataset sales royalties - Dialog Pairs'),
((SELECT id FROM users WHERE email='neha@freelancer.com'), 'earning', 35000, 'Completed 600 task submissions'),
((SELECT id FROM users WHERE email='neha@freelancer.com'), 'earning', 16000, 'Dataset sales royalties - Product NER'),
((SELECT id FROM users WHERE email='vikram@freelancer.com'), 'earning', 30000, 'Completed 500 task submissions'),
((SELECT id FROM users WHERE email='vikram@freelancer.com'), 'earning', 13000, 'Dataset sales royalties'),
((SELECT id FROM users WHERE email='sunita@freelancer.com'), 'earning', 20000, 'Completed 400 task submissions'),
((SELECT id FROM users WHERE email='sunita@freelancer.com'), 'earning', 12000, 'Dataset sales royalties - Audio'),
((SELECT id FROM users WHERE email='amit@freelancer.com'), 'earning', 15000, 'Completed 300 task submissions'),
((SELECT id FROM users WHERE email='amit@freelancer.com'), 'earning', 6000, 'Dataset sales royalties'),
((SELECT id FROM users WHERE email='rohit@freelancer.com'), 'earning', 10000, 'Completed 200 task submissions'),
((SELECT id FROM users WHERE email='rohit@freelancer.com'), 'earning', 5000, 'Dataset sales royalties');

-- INSERT SUBMISSIONS
INSERT INTO submissions (task_id, freelancer_id, submission_data, verified, ai_confidence, shinra_message) VALUES
((SELECT id FROM tasks WHERE title='Label 500 Hindi Sentiment Tweets' LIMIT 1), 
 (SELECT id FROM users WHERE email='arjun@freelancer.com'), 
 '{"tweets_labeled": 100, "accuracy": 0.96}'::jsonb, 
 true, 0.96, '✅ VERIFIED by SHINRA - 96% confidence'),
((SELECT id FROM tasks WHERE title='Label 500 Hindi Sentiment Tweets' LIMIT 1), 
 (SELECT id FROM users WHERE email='priya@freelancer.com'), 
 '{"tweets_labeled": 80, "accuracy": 0.94}'::jsonb, 
 true, 0.94, '✅ VERIFIED by SHINRA - 94% confidence'),
((SELECT id FROM tasks WHERE title='Draw Bounding Boxes on Faces' LIMIT 1), 
 (SELECT id FROM users WHERE email='raj@freelancer.com'), 
 '{"images_labeled": 50, "total_boxes": 235, "quality": "high"}'::jsonb, 
 true, 0.97, '✅ VERIFIED by SHINRA - 97% confidence'),
((SELECT id FROM tasks WHERE title='Transcribe Hindi Audio Clips' LIMIT 1), 
 (SELECT id FROM users WHERE email='neha@freelancer.com'), 
 '{"audio_files": 15, "hours_transcribed": 45, "accuracy": 0.95}'::jsonb, 
 true, 0.95, '✅ VERIFIED by SHINRA - 95% confidence');

-- INSERT PURCHASES
INSERT INTO purchases (buyer_id, dataset_id, amount_paid) VALUES
((SELECT id FROM users WHERE email='company@scalai.com'), 
 (SELECT id FROM datasets WHERE title='50K Hindi Movie Reviews - Sentiment Labeled' LIMIT 1), 
 15000),
((SELECT id FROM users WHERE email='company@scalai.com'), 
 (SELECT id FROM datasets WHERE title='10K Indian Faces - Annotated' LIMIT 1), 
 8000),
((SELECT id FROM users WHERE email='company@flipkart.com'), 
 (SELECT id FROM datasets WHERE title='5K Indian Food Images - Categorized' LIMIT 1), 
 12000),
((SELECT id FROM users WHERE email='company@flipkart.com'), 
 (SELECT id FROM datasets WHERE title='25K Product Titles - NER Annotated' LIMIT 1), 
 4500);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
SELECT 
  'Users created' as stat, COUNT(*)::text as count FROM users
UNION ALL
SELECT 'Tasks posted', COUNT(*)::text FROM tasks
UNION ALL
SELECT 'Datasets available', COUNT(*)::text FROM datasets
UNION ALL
SELECT 'Task submissions', COUNT(*)::text FROM submissions
UNION ALL
SELECT 'Purchases made', COUNT(*)::text FROM purchases
UNION ALL
SELECT 'Transactions recorded', COUNT(*)::text FROM transactions;

