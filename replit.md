# SHINRA LABS - Project Documentation

## Overview
SHINRA LABS is a decentralized AI workforce platform offering multi-modal AI data annotation and a dataset marketplace. It aims to empower businesses with high-quality data and provide freelancers with opportunities. The platform is built using React, Vite, Tailwind CSS, and Supabase. It is production-ready, featuring robust security, comprehensive authorization controls, and a fully integrated Supabase backend.

## User Preferences
None documented yet.

## System Architecture
SHINRA LABS is a React 18 + Vite 5 application with a Supabase backend (PostgreSQL, RLS, Secure RPC Functions).

**UI/UX Decisions:**
- **Design System:** Tailwind CSS 3 for utility-first styling, PostCSS for processing.
- **Theming:** Dark theme with glassmorphism design elements.
- **Responsiveness:** Fully responsive for mobile, tablet, and desktop.
- **PWA:** Progressive Web App (PWA) enabled for installability and offline functionality via service workers.
- **Animations:** Framer Motion for smooth UI transitions.
- **Internationalization:** Support for English and Hindi.
- **Header:** Professional sticky header with glassmorphism, SHINRA Labs logo, navigation links, search, notifications, and profile dropdown. Responsive with a hamburger menu for mobile.
- **Footer:** Comprehensive 4-column responsive footer with brand info, product links, resources, and social media.
- **Landing Page:** Modern, conversion-focused layout with a hero section, trust badges, feature cards, a 4-step "How It Works" section, and dual CTAs.
- **Dashboards:** Professional key stats cards with glassmorphism design, gradient backgrounds, trend indicators, and animated charts.
- **Authentication UI:** Modals for phone number OTP verification and dedicated buttons for Google OAuth integration.

**Technical Implementations & Feature Specifications:**
- **Multi-modal Annotation:** Support for text, image, audio, and video data annotation. Submissions are saved to Supabase, updating task progress and generating notifications. Includes draft saving.
- **Dataset Marketplace:** Functionality to list, rate, review, and securely purchase datasets (free and paid).
- **Gamification System:** Implements XP, levels, badges, achievements, and streaks with leaderboards.
- **Role-Based Dashboards:** Distinct dashboards for Freelancers (earnings, tasks, leaderboards) and Companies (active projects, spending, labels completed).
- **Authentication:**
    - Email/Password authentication.
    - Google OAuth (Sign in with Google) with automatic user profile creation.
    - Phone number OTP verification with multi-country code support and automatic profile creation.
- **Wallet System:** Manages transactions, secure withdrawals via RPC functions, balance management, and transaction filtering.
- **Admin Dashboard:** User management, task approval queue, secure approval/rejection workflows, and platform-wide statistics.
- **Profile Management:** Full profile editing, avatar uploads via Supabase Storage, and settings management.
- **Notification System:** Real-time notifications from the database with 'mark as read' functionality and category filtering.
- **Database Schema:**
    - **`schema.sql`**: Core tables including Users (freelancers, companies, admins), Tasks, Datasets, Submissions, Purchases, Transactions, Notifications, and Leaderboard view. Basic Row-Level Security (RLS) policies.
    - **`schema_v2_enhancements.sql`**: Admin role support, gamification features (XP, levels, badges, achievements, streaks), enhanced RLS for privacy, and performance indexes.
- **Secure RPC Functions (`secure_operations.sql`):**
    - `secure_withdrawal()`: Server-side validation for withdrawals, balance verification, and atomic transactions.
    - `secure_purchase()`: Database-derived pricing, duplicate prevention, and atomic operations.
    - `secure_approve_submission()`: Admin-only approval, status validation, and automatic payout processing.
    - All functions use `SECURITY DEFINER` and `auth.uid()` for robust authorization.
- **Security:**
    - Comprehensive Row-Level Security (RLS) policies across all tables, ensuring data privacy and access control (e.g., users view only their data, admins have broader access).
    - Admin route protection using a `useAdmin` hook and `ProtectedRoute` component for server-side role verification.
    - Financial transaction validations: positive amount checks, duplicate operation prevention, row-level locking (FOR UPDATE), balance validation, and server-side price verification.

**Project Structure:**
- `src/components/`: Reusable UI components (Annotation, Company, Gamification, Layout, Tasks).
- `src/contexts/`: React contexts (Auth, Theme).
- `src/i18n/`: Internationalization files.
- `src/pages/`: Page-level components.
- `src/services/`: API services, including Supabase client (`supabase.js`).
- `src/App.jsx`: Main application component.
- `src/main.jsx`: Application entry point.

**Configuration:**
- **Environment Variables (Replit Secrets):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- **Development Server:** Host `0.0.0.0`, Port `5000` (for Replit).
- **Deployment:** Autoscale web application, `npm run build` for build, `npx vite preview --host 0.0.0.0 --port 5000` for run.

## External Dependencies
- **Backend-as-a-Service:** Supabase (PostgreSQL, Authentication, Realtime, Storage, Edge Functions)
- **Frontend Framework:** React 18, Vite 5
- **Styling:** Tailwind CSS 3, PostCSS
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **File Upload:** React Dropzone
- **Media Playback:** React Player
- **Internationalization:** react-i18next
- **Notifications/Toasts:** React Hot Toast