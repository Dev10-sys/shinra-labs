# SHINRA Labs – Minimal React + Supabase MVP

This project is a clean implementation of the SHINRA Labs prototype:

- React + Vite + Tailwind CSS
- Supabase for database and basic auth logic
- Simple black and white interface, dashboard-style

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Ensure your Supabase database has these tables (names must match exactly):

- `users`
- `tasks`
- `submissions`
- `datasets`
- `purchases`

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open the printed local URL in your browser.

Sign in from the **Login** page with any name + email. The app will:

- Look up a matching row in `users`
- If missing, create one (with the selected role: `freelancer` or `company`)
- Route you to the corresponding dashboard

The freelancer dashboard reads from:

- `tasks` (status = 'open')  
- `submissions` (for storing demo work)

The company dashboard writes to:

- `tasks` (creates new labeling tasks)

The dataset marketplace reads from:

- `datasets`
