-- ============================================
-- SHINRA LABS - SCHEMA ENHANCEMENTS V2
-- Run AFTER initial schema.sql
-- ============================================

-- Add admin role support
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('freelancer', 'company', 'admin'));

-- Add gamification fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0 CHECK (xp_points >= 0);
ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '["English"]'::jsonb;

-- Add task enhancements
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium' 
  CHECK (difficulty IN ('easy', 'medium', 'hard'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS items_count INTEGER DEFAULT 1;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS accepted_by INTEGER DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

-- Add submission status
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('task', 'payment', 'system', 'achievement')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create achievements/badges table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements junction table
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Insert achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value) VALUES
('Top Performer', 'Complete 100+ tasks', '🏆', 'tasks_completed', 100),
('Speed Demon', 'Complete task in <10 minutes', '⚡', 'speed', 10),
('Accuracy Master', 'Maintain >99% accuracy', '🎯', 'accuracy', 99),
('Diamond Tier', 'Reach level 10', '💎', 'level', 10),
('Hot Streak', 'Work for 7 consecutive days', '🔥', 'streak', 7),
('Rising Star', 'Top 10 in first month', '🌟', 'rank', 10)
ON CONFLICT (name) DO NOTHING;

-- RLS policies for new tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view achievements" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Everyone can view user achievements" ON user_achievements
  FOR SELECT USING (true);

-- Insert admin user
INSERT INTO users (email, name, role, balance, total_earned, rating, tasks_completed)
VALUES ('admin@shinralabs.com', 'SHINRA Admin', 'admin', 0, 0, 5.0, 0)
ON CONFLICT (email) DO NOTHING;

-- Update existing users with XP based on tasks completed
UPDATE users 
SET xp_points = tasks_completed * 100,
    level = LEAST(100, GREATEST(1, (tasks_completed / 10) + 1))
WHERE role = 'freelancer';

-- ============================================
-- CRITICAL SECURITY: RLS POLICIES
-- ============================================

-- Enable RLS on users table if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Restrict users table access
DROP POLICY IF EXISTS "Users can view all profiles" ON users;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CRITICAL: Restrict admin operations on tasks
CREATE POLICY "Only admins can approve tasks" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CRITICAL: Restrict submission approvals
DROP POLICY IF EXISTS "Freelancers can update own submissions" ON submissions;

CREATE POLICY "Only admins can approve submissions" ON submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
