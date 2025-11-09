# SHINRA LABS - Decentralized AI Workforce Platform

A world-class multi-modal AI data annotation and dataset marketplace platform built with React, Supabase, and Tailwind CSS.

## Features

- 🎨 **Modern UI/UX** - Dark theme with glassmorphism, smooth animations, and micro-interactions
- 👥 **Role-Based Access** - Separate dashboards for Freelancers, Companies, and Researchers
- 📊 **Multi-Modal Annotation** - Support for images, videos, audio, and text annotation
- 🏪 **Dataset Marketplace** - Buy and sell AI datasets with ratings and reviews
- 🎮 **Gamification** - Leaderboards, badges, streaks, and XP system
- 💰 **Payment Integration** - Mock Razorpay integration with wallet system
- 🌐 **Localization** - English and Hindi support
- ♿ **Accessibility** - Full keyboard navigation and screen reader support
- 📱 **PWA Ready** - Progressive Web App with offline support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the database schema in your Supabase SQL editor (use the provided SQL file)

5. Start the development server:
```bash
npm run dev
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API
- **Internationalization**: react-i18next

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── contexts/       # React contexts (Auth, Theme, etc.)
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── services/       # API services (Supabase)
├── i18n/           # Internationalization files
└── styles/         # Global styles
```

## License

MIT

