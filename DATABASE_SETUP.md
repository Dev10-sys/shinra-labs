# SHINRA Labs - Database Setup Guide

## Quick Start (3 Steps)

### Step 1: Run Main Schema
Copy and run `FINAL_SCHEMA.sql` in Supabase SQL Editor (creates all tables)

### Step 2: Sign Up Demo Users
1. Open app: `npm run dev`
2. Go to: http://localhost:5173/signup
3. Create accounts:
   - **Company**: admin@shinra.com / demo123
   - **Freelancer**: cloud@avalanche.net / demo123

### Step 3: Seed Demo Data
Run `SETUP_DEMO_DATA.sql` (adds 4 tasks, 2 submissions, 3 datasets, notifications)

### Optional: Fix Existing Users
If you already signed up but see "profile not found", run `FIX_EXISTING_USERS.sql`

---

## Files Explained

- `FINAL_SCHEMA.sql` - Master database schema (run first)
- `SETUP_DEMO_DATA.sql` - Demo data seeder (run after signup)
- `FIX_EXISTING_USERS.sql` - Repairs existing auth users (emergency fix)

## Production Deployment

1. Update `.env` with production Supabase URL/Key
2. Build: `npm run build`
3. Deploy `dist/` folder to Vercel/Netlify
4. Run `FINAL_SCHEMA.sql` on production Supabase
