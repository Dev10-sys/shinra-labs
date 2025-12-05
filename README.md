# SHINRA Labs - Final Setup

## ✅ Credentials Updated
Your `.env` file has been updated with the new Supabase credentials:
- **URL:** `https://afawlkbrrdvkiplkmjbi.supabase.co`
- **Key:** `eyJhbGciOiJIUzI1Ni...` (Updated)

---

## 🚀 Next Steps (Do this now)

### 1. Run Schema in Supabase
1. Go to [Supabase SQL Editor](https://afawlkbrrdvkiplkmjbi.supabase.co/project/sql).
2. Open **`MASTER-SCHEMA-V3.sql`** from this folder.
3. Copy **ALL** code and **Run** it.
   - *This creates tables, fixes the 'difficulty' error, and adds datasets.*

### 2. Restart App
1. Stop the running server (Ctrl+C).
2. Run:
   ```bash
   npm run dev
   ```

### 3. Create Tasks
1. Go to your app (`localhost:5173`).
2. **Sign Up** as a Company (e.g., `admin@shinra.com`).
3. Go back to Supabase SQL Editor.
4. Open **`SEED-TASKS.sql`**.
5. Copy & **Run** it.
   - *This adds demo tasks for your new user.*

---

## 🎉 Done!
Your app is now fully connected and populated with data.
