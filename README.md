# SHINRA Labs – The Next-Gen AI Data Infrastructure Platform

SHINRA Labs is a full-stack AI data labeling and training-data operations platform built for modern AI teams.  
It solves the hardest problems in dataset creation: scalability, quality, workforce management, annotation consistency, and end-to-end production flow.

Our mission is simple:  
**Enable companies to build high-quality AI datasets at scale with precision, auditability, and speed.**

---

## Why SHINRA Labs Exists (The Problem)

Modern AI systems need massive labeled datasets — but current annotation pipelines are broken:

- **Low Quality:** Inconsistent annotations, poor worker training, missing consensus checks.  
- **Slow Delivery:** Traditional labeling operations can't scale with AI training cycles.  
- **Fragmented Tools:** Companies juggle spreadsheets, PDFs, inboxes, and outdated UIs.  
- **Zero Transparency:** No quality metrics, no reviewer insights, no worker performance data.  
- **High Cost:** Enterprise data platforms are overpriced and inaccessible to smaller teams.  
- **No Real-time Collaboration:** Reviewers, annotators, and companies operate in silos.

SHINRA Labs fixes all of this by providing a **single integrated production pipeline** for dataset creation.

---

## What SHINRA Labs Offers (The Solution)

A full end-to-end system to manage datasets, workers, tasks, reviews, and marketplace operations —  
**all under one scalable infrastructure layer.**

### Core Capabilities

- **Enterprise-grade Task Management**  
  Full lifecycle: create → assign → annotate → submit → review → approve.

- **High-Precision Annotation Workspace**  
  Bounding boxes, validation rules, auto-save, revision tracking, and real-time previews.

- **Workforce Management Layer**  
  Companies manage annotators, score their performance, and monitor quality.

- **Quality Assurance Engine**  
  Consensus scoring, reviewer panel, correction history, and reliability indicators.

- **Dataset Marketplace**  
  Verified datasets can be published, bought, sold, or integrated into training pipelines.

- **Real-time System**  
  Supabase-powered instant notifications, updates, and collaboration workflows.

- **Developer Friendly**  
  Clean modular architecture, simple environment setup, and scalable design patterns.

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS  
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage)  
- **Routing:** React Router v6  
---

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase Account

### Installation

```bash
npm install

cp .env.example .env
# Add your Supabase credentials:
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=

npm run dev
npm run build
