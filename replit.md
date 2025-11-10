# SHINRA LABS - Project Documentation

## Overview
SHINRA LABS is a decentralized AI workforce platform that provides multi-modal AI data annotation and a dataset marketplace. Built with React, Vite, Tailwind CSS, and Supabase (PostgreSQL backend).

## Project Status
- **Status**: Fully configured and running on Replit
- **Last Updated**: November 10, 2025
- **Framework**: React 18 + Vite 5
- **Backend**: Supabase (PostgreSQL)

## Key Features
- Multi-modal annotation support (text, image, audio, video)
- Dataset marketplace with ratings and reviews
- Gamification system with leaderboards
- Role-based dashboards (Freelancers vs Companies)
- Multiple authentication options:
  - Email/Password authentication
  - Google OAuth (Sign in with Google)
  - Phone number OTP verification
- Internationalization (English & Hindi)
- Dark theme with glassmorphism design

## Project Structure
```
src/
├── components/     # Reusable UI components
│   ├── Annotation/ # Annotation tools for different media types
│   ├── Company/    # Company-specific components
│   ├── Gamification/ # Leaderboard and gamification
│   ├── Layout/     # Sidebar and navigation
│   └── Tasks/      # Task management components
├── contexts/       # React contexts (Auth, Theme)
├── i18n/          # Internationalization (English/Hindi)
├── pages/         # Page components
├── services/      # API services (Supabase client)
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## Configuration

### Environment Variables
The following secrets are configured in Replit Secrets:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key

### Development Server
- **Host**: 0.0.0.0 (configured for Replit environment)
- **Port**: 5000 (required for Replit webview)
- **Command**: `npm run dev`

### Deployment Configuration
- **Type**: Autoscale (stateless web application)
- **Build**: `npm run build`
- **Run**: `npx vite preview --host 0.0.0.0 --port 5000`

## Database Setup
The database schema is located in `database/schema.sql`. This needs to be executed in your Supabase SQL editor to create:
- Users table (freelancers and companies)
- Tasks table (annotation tasks)
- Datasets table (marketplace datasets)
- Submissions table (task submissions)
- Purchases and Transactions tables
- Leaderboard view
- Row-level security policies

## Technology Stack
- **Frontend**: React 18, Vite 5
- **Styling**: Tailwind CSS 3, PostCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **Media Player**: React Player
- **Internationalization**: react-i18next
- **Notifications**: React Hot Toast

## Recent Changes
### November 10, 2025 - Phone Number Authentication
- Added phone number authentication with OTP verification
- Implemented PhoneAuthModal with two-step flow (phone input → OTP verification)
- Added "Sign in with Phone" button to login and signup pages
- Supports multiple country codes (+91 India, +1 US, +44 UK, +86 China, +81 Japan)
- 30-second countdown timer for OTP resend
- Auto-creates user profile for phone users with 'freelancer' role

### November 10, 2025 - Google Sign-In Integration
- Added Google OAuth authentication via Supabase
- Implemented automatic user profile creation for OAuth users
- Added "Sign in with Google" button to login page
- Added "Sign up with Google" button to signup page
- Google-authenticated users default to 'freelancer' role

### November 10, 2025 - Initial Replit Setup
- Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- Fixed PostCSS/Tailwind CSS errors in index.css
- Set up environment variables via Replit Secrets
- Configured frontend workflow for development server
- Set up deployment configuration for production
- Application verified working with homepage loading successfully

## Known Issues
None at this time. Application is running successfully.

## Development Workflow
1. Development server runs automatically via the frontend workflow
2. Changes auto-reload via Vite HMR
3. Access the app through the Replit webview on port 5000

## User Preferences
None documented yet.
