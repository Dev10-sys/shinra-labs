# SHINRA Labs – Professional AI Data Labeling Platform

SHINRA Labs is a production-grade B2B SaaS platform for AI training data creation, annotation management, and dataset marketplace operations.  
It is built for modern AI teams that require scalable, high-quality, and fully auditable data pipelines.

Our objective is to deliver a **full-stack AI data infrastructure layer** that empowers companies to build accurate, reliable, and high-volume datasets with complete transparency.

---

## Why SHINRA Labs Exists (The Problem)

Modern AI teams struggle with dataset creation:

- **Inconsistent quality** due to untrained or unmanaged workforces  
- **Slow labeling cycles** that bottleneck AI model training  
- **Fragmented tools** (spreadsheets, PDFs, manual reviews)  
- **Zero visibility** into annotator performance or dataset health  
- **Expensive enterprise tools** that small teams cannot afford  
- **No real-time collaboration** between annotators, reviewers, and companies  

SHINRA Labs solves this by providing a **single, integrated, real-time platform** for data labeling operations.

---

## What SHINRA Labs Does (The Solution)

A complete end-to-end labeling ecosystem:

- High-speed annotation workspace  
- Full task lifecycle management  
- Real-time collaboration  
- Reviewer and QA scoring tools  
- Dataset marketplace  
- Enterprise-grade dashboards  
- Supabase-backed scalable infra  

All under one unified platform.

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS  
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage)  
- **Routing:** React Router v6  
- **Design Philosophy:**  
  Inspired by **Scale AI, Labelbox, and enterprise AI tooling** — minimal, efficient, monochrome, technical.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase Account

### Installation

```bash
npm install

cp .env.example .env

npm run dev
npm run build

## System Architecture

```markdown
                     ┌─────────────────────────┐
                     │     Frontend (React)     │
                     │  Vite + Tailwind + RRD   │
                     └─────────────┬───────────┘
                                   │
                                   ▼
                    ┌───────────────────────────────────┐
                    │          Supabase Backend         │
                    │───────────────────────────────────│
                    │  • Auth (RBAC: Company/Worker)     │
                    │  • Postgres Database               │
                    │  • Realtime WebSockets             │
                    │  • SQL + RLS                       │
                    │  • Storage (Images/Datasets)       │
                    └───────────────┬───────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────┐
                    │         Core Business Logic       │
                    │──────────────────────────────────│
                    │ • Tasks / Projects                │
                    │ • Annotations                     │
                    │ • QA Reviews                      │
                    │ • Marketplace Listings            │
                    │ • Purchases                       │
                    └──────────────────────────────────┘

##  End-to-End Annotation Workflow

Company Creates Project
        │
        ▼
Uploads Raw Dataset
        │
        ▼
Task Assigned to Freelancers
        │
        ▼
Freelancer Annotates & Submits Work
        │
        ▼
Reviewer Conducts Quality Check
        │
        ├── Accept → Final Dataset
        │
        └── Reject → Returned for Fix
                │
                ▼
        Freelancer Re-Submits



##  Dataset Marketplace Flow

Company Uploads Dataset
        │
        ▼
Internal Verification
        │
        ▼
Dataset Published to Marketplace
        │
        ▼
Buyers Browse & Purchase
        │
        ▼
Dataset Unlocked on Payment


#Role-Based Access Flow

                ┌──────────────────┐
                │      COMPANY      │
                └───────┬──────────┘
                        ▼
        ┌─────────────────────────────────┐
        │ • Create Projects/Tasks         │
        │ • Upload Datasets               │
        │ • Review / Approve / Reject     │
        │ • Manage Workforce              │
        │ • Publish to Marketplace        │
        └─────────────────────────────────┘

                ┌──────────────────┐
                │    FREELANCER    │
                └───────┬──────────┘
                        ▼
         ┌────────────────────────────────┐
         │ • Browse Tasks                 │
         │ • Annotate & Submit Work       │
         │ • Fix Rejected Submissions     │
         │ • Track Quality Score          │
         └────────────────────────────────┘




