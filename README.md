# SHINRA Labs - Professional AI Data Labeling Platform

Production-ready B2B SaaS platform for AI training data annotation and marketplace.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Routing**: React Router DOM v6
- **Design**: "Scale AI" Inspired - Monochrome, Technical, Enterprise

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase Account

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Run development server
npm run dev

# Build for production
npm run build
```

### Database Setup

1. Create a new Supabase project
2. Run the schema from `FINAL_SCHEMA.sql` in Supabase SQL Editor
3. Run `SETUP_DEMO_DATA.sql` to populate with demo users and tasks

## Features

- **Dual-Role System**: Company (employers) and Freelancer (annotators)
- **Task Management**: Create, assign, submit, review workflow
- **Real-time Annotations**: Interactive bounding box labeling workspace
- **Dataset Marketplace**: Buy/sell verified labeled datasets
- **Quality Assurance**: AI-powered confidence scores and consensus visualization
- **Notifications**: Real-time alerts for task updates and payments

## Demo Credentials

For demonstration purposes:

**Company Account:**
- Email: `admin@shinra.com`
- Password: `demo123`

**Freelancer Account:**
- Email: `cloud@avalanche.net`
- Password: `demo123`

## Architecture

### Key Components
- `App.jsx` - Main router with protected routes
- `authUtils.js` - Authentication helpers
- `supabaseClient.js` - Database client configuration

### Pages
- `HomePage.jsx` - Marketing landing page
- `LoginPage.jsx` / `SignUpPage.jsx` - Authentication
- `CompanyDashboard.jsx` - Employer portal
- `FreelancerDashboard.jsx` - Annotator workspace
- `CreateProjectPage.jsx` - Task creation flow with AI simulation
- `SubmitWorkPage.jsx` - Interactive annotation interface
- `TaskReviewPage.jsx` - Quality assurance console
- `DatasetMarketplace.jsx` - Dataset trading platform
- `ProfilePage.jsx` - User profile management

## License

Proprietary - All Rights Reserved
