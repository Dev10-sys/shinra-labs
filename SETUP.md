# SHINRA LABS - Setup Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account (free tier works)
- Git (optional)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to **Settings > API** and copy:
   - Project URL
   - Anon/public key

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `database/schema.sql` from this project
4. Copy and paste the entire SQL script into the SQL Editor
5. Click **Run** to execute the script
6. Verify the tables were created by checking the **Table Editor**

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication > Settings**
2. Enable **Email** provider (should be enabled by default)
3. Optionally configure email templates

## Step 6: Run the Application

```bash
npm run dev
```

The app will start at `http://localhost:3000`

## Step 7: Test the Application

### Demo Credentials

The database schema includes demo users. However, you'll need to create accounts through the signup flow or manually create users in Supabase Auth.

**Recommended**: Use the signup page to create test accounts:
- Freelancer account
- Company account

### Test Flows

1. **Sign Up** → Create a freelancer or company account
2. **Login** → Sign in with your credentials
3. **Freelancer Flow**:
   - View available tasks
   - Pick a task
   - Complete annotation
   - Submit and earn
4. **Company Flow**:
   - Post a new task
   - Upload a dataset
   - View analytics

## Troubleshooting

### Database Connection Issues

- Verify your `.env` file has correct Supabase credentials
- Check that your Supabase project is active
- Ensure RLS policies are set up correctly

### Authentication Issues

- Make sure email provider is enabled in Supabase
- Check browser console for error messages
- Verify user exists in both `auth.users` and `public.users` tables

### Build Issues

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Add environment variables in Netlify dashboard

## Features Implemented

✅ Role-based authentication (Freelancer, Company)
✅ Multi-modal annotation (Image, Video, Audio, Text)
✅ Dataset marketplace with filters
✅ Gamification (Leaderboard, badges)
✅ Real-time stats and analytics
✅ Payment/wallet system
✅ Localization (English/Hindi)
✅ Dark theme with glassmorphism
✅ Responsive design
✅ Framer Motion animations
✅ Supabase integration with RLS

## Next Steps

- Add more annotation tools
- Implement real-time collaboration
- Add PWA support
- Enhance AI auto-labeling
- Add more payment gateways
- Implement advanced analytics

## Support

For issues or questions, check the README.md or open an issue in the repository.

