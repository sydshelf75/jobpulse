# JobPulse — AI Job Agent on WhatsApp

**"Your personal job search assistant, delivered every morning on WhatsApp."**

---

## What is JobPulse?

JobPulse is an AI-powered WhatsApp agent that acts as your personal job search companion. Every morning, it sends you a curated daily briefing — fresh job postings matched to your profile, updates on applications you've submitted, interview reminders, and a snapshot of what's happening in the job market. And unlike a newsletter, you can talk back to it. Ask it to filter jobs by salary, find roles at a specific company, reschedule an interview reminder, or just ask "what should I apply to today?" — all from WhatsApp, the app you already live in.

The entire system is built on Next.js, handling both the frontend dashboard and the backend API routes, keeping the architecture clean and unified in a single codebase.

---

## The Problem It Solves

Job searching is exhausting and fragmented. You're juggling LinkedIn, Naukri, Indeed, company career pages, your own spreadsheet of applications, and a mental calendar of interviews — all at once. Most people miss good opportunities simply because they didn't check the right platform that day, or forgot to follow up on an application. JobPulse collapses all of this into one place — your WhatsApp — and makes your job search proactive instead of reactive.

---

## Core Features

**Daily Morning Briefing on WhatsApp**
Every day at a time you choose, JobPulse sends you a structured WhatsApp message with four sections — new job postings that match your skills and preferences scraped from LinkedIn, Naukri, Indeed, and target company websites; a status summary of your tracked applications; any interview reminders for the day or upcoming week; and a short market trend snippet like "Frontend roles in Bangalore up 12% this week" or "Product Manager demand softening in startups". The message is clean, readable, and formatted perfectly for mobile.

**Two-Way Conversational AI on WhatsApp**
JobPulse is not a one-way broadcast. You can reply to any message and have a full conversation. Ask it "show me only remote React jobs above 20 LPA", "add the Razorpay application to my tracker", "remind me about my Swiggy interview 2 hours before", or "what companies are hiring senior engineers in Pune right now?" — and it responds intelligently using Claude as its brain. The conversation feels natural, not like filling out a form.

**Job Scraping Engine**
JobPulse scrapes LinkedIn Jobs, Naukri, and Indeed on a scheduled basis using a headless browser pipeline. It also monitors specific company career pages that the user adds to their watchlist. Every scrape is deduplicated, normalized into a consistent format, and then filtered against the user's profile — their role, skills, experience level, preferred location, and salary range. Only relevant jobs make it into the daily briefing.

**Application Tracker**
Users can tell JobPulse about jobs they've applied to, either through the WhatsApp chat ("I just applied to Flipkart for the PM role") or through the web dashboard. JobPulse stores this, tracks how many days since application, and surfaces aging applications in the daily briefing with a nudge to follow up if there's been no response in 7–10 days.

**Interview Reminder System**
When a user adds an interview to their tracker, JobPulse automatically schedules a WhatsApp reminder — the night before and again 2 hours before. It also sends a prep message with the company name, role, interview time, and a quick note about what to review based on the job description.

**Job Market Trends**
JobPulse aggregates data from its scraping pipeline to surface weekly trends — which roles are seeing increased postings, which companies are hiring aggressively, salary benchmarks for specific roles, and which skills are appearing most frequently in job descriptions. This helps users make smarter decisions about what to apply to and how to position themselves.

**Web Dashboard**
Beyond WhatsApp, users have access to a Next.js web dashboard where they can set up their profile, manage their job preferences, view their full application tracker, browse all scraped jobs in a searchable interface, configure their daily briefing time, and add company watchlists. The dashboard is fully responsive and works on mobile browsers too.

**Onboarding via WhatsApp**
New users onboard entirely through WhatsApp — no friction. JobPulse sends them a welcome message and walks them through a quick setup conversation: what role are you looking for, what's your experience level, preferred location, salary range, and what platforms to pull from. Within 5 minutes of connecting, they're set up and will receive their first briefing the next morning.

---

## Full Technical Architecture

**Frontend & Backend — Next.js (Unified)**
The entire application lives in a single Next.js codebase. The frontend is the user-facing web dashboard built with React and Tailwind CSS. The backend is handled entirely through Next.js API routes — no separate Express or FastAPI server. This keeps deployment simple (Vercel or a single Node server), the codebase unified, and the developer experience clean.

API routes handle webhook events from WhatsApp, job scraping triggers, scheduled job dispatching, user profile management, and application tracking CRUD. For background jobs like scraping and sending daily briefings, Next.js API routes are triggered by a cron scheduler (using Vercel Cron or a lightweight external cron like cron-job.org hitting your API endpoints).

**WhatsApp Integration — Twilio or Meta Cloud API**
WhatsApp connectivity is handled via either Twilio's WhatsApp Business API or the official Meta Cloud API (both are solid choices). Incoming messages hit a Next.js webhook endpoint, get processed by the AI pipeline, and a response is sent back. Outbound messages for daily briefings are dispatched via scheduled API calls. The WhatsApp Business API requires a registered business number, which is a one-time setup.

**AI Brain — Claude API**
All conversational intelligence is powered by Claude. When a user sends a message on WhatsApp, the system constructs a context-rich prompt that includes the user's profile, their current tracked applications, recent jobs scraped for them, and the conversation history. Claude processes this and returns a structured response that is then formatted into WhatsApp-friendly text (since WhatsApp supports basic bold and bullet formatting via asterisks and dashes).

**Job Scraping — Playwright + Cheerio**
Job scraping is done using Playwright for JavaScript-heavy sites like LinkedIn (which requires login simulation and scroll handling) and Cheerio for lighter HTML parsing on sites like Naukri and Indeed. Scrapers run on a schedule — every 6–12 hours — and results are deduplicated by job ID or URL, normalized into a standard schema, and stored in the database. For company-specific career pages added by users, a more targeted Playwright scraper visits those URLs and extracts listings.

A word on LinkedIn scraping — LinkedIn actively blocks scrapers, so the production approach should use their official Jobs API where possible, or use a third-party jobs aggregator API like JSearch (RapidAPI) or Adzuna as a complement to direct scraping to stay within legal and technical boundaries.

**Database — PostgreSQL with Prisma ORM**
PostgreSQL stores all persistent data — user profiles, job listings, application tracker records, conversation history, scraping metadata, and notification logs. Prisma is used as the ORM, giving type-safe database queries that integrate cleanly with the Next.js TypeScript codebase.

**Redis — Caching & Queue**
Redis handles two things — caching frequently accessed data like recent job listings and user preferences so every WhatsApp message doesn't hit the database cold, and acting as a simple job queue for scraping tasks and notification dispatch using BullMQ.

**Authentication — NextAuth.js**
The web dashboard uses NextAuth.js for authentication. Users sign in with Google or LinkedIn OAuth. Their account is linked to their WhatsApp number so the web session and WhatsApp identity are unified.

**Hosting & Deployment**
The Next.js app deploys to Vercel for zero-config deployment with built-in cron support. PostgreSQL runs on Supabase or Railway. Redis runs on Upstash (serverless Redis that works perfectly with Vercel's serverless functions). The Playwright scraper, being too heavy for serverless, runs on a small dedicated VM (a $5–10 DigitalOcean droplet) and is triggered via an API call from the Next.js cron.

---

## Full Development Roadmap

**Project Setup & Infrastructure**
Initialize the Next.js project with TypeScript, Tailwind CSS, Prisma, and NextAuth. Set up PostgreSQL on Supabase and Redis on Upstash. Configure environment variables and deploy a base version to Vercel. Set up the WhatsApp Business API sandbox via Twilio for development testing. Establish the database schema for users, jobs, applications, conversations, and notifications.

**WhatsApp Webhook & Messaging Layer**
Build the incoming webhook API route that receives WhatsApp messages. Build the outbound messaging utility that sends WhatsApp messages (text, formatted lists, and interactive buttons where supported). Test the full round-trip — send a message on WhatsApp, receive it in the Next.js webhook, send a reply back. Handle message deduplication and delivery status tracking.

**User Onboarding Flow**
Build the WhatsApp onboarding conversation flow powered by Claude. When a new number messages JobPulse for the first time, it triggers a guided setup — collecting role preferences, location, experience, salary expectations, and platforms to monitor. Store this as the user's profile. At the end of onboarding, confirm their daily briefing time. Also build the web dashboard onboarding as an alternative path.

**Job Scraping Engine**
Build the Playwright-based scrapers for LinkedIn (using JSearch API as primary, Playwright as fallback), Naukri, and Indeed. Build the company career page watcher. Set up the normalization pipeline that converts raw scrape output into the standard job schema. Build the deduplication logic. Deploy the scraper to a DigitalOcean VM and expose a simple API endpoint that the Next.js cron can trigger.

**Job Filtering & Matching**
Build the matching engine that takes a user's profile and filters the scraped job pool to find relevant listings. Use a combination of keyword matching, location filtering, salary range filtering, and experience level matching. Optionally use Claude to do a semantic relevance score for each job against the user's profile for higher quality matching.

**Application Tracker**
Build the application tracker data model and API routes. Build the WhatsApp interface for adding applications via chat. Build the web dashboard UI for managing applications — a Kanban-style board with columns for Applied, In Review, Interview Scheduled, Offer, Rejected. Build the aging logic that flags applications with no update after a configurable number of days.

**Interview Reminder System**
Build the interview scheduling feature — users add interviews via chat or dashboard. Build the notification scheduler using BullMQ that queues two reminders per interview — the evening before and 2 hours before. Build the prep message generator that uses Claude to pull key details from the job description and craft a short preparation note.

**Daily Briefing Engine**
Build the daily briefing composer. This is a scheduled job (Vercel Cron at the user's chosen time) that for each user pulls their matched jobs from the last 24 hours, their application status summary, any upcoming interviews, and a market trend snippet — then formats this into a well-structured WhatsApp message and dispatches it. Handle users in different timezones correctly.

**Job Market Trends Engine**
Build the trends aggregation pipeline that runs weekly across all scraped data — counting role frequency, location distribution, skill mentions, and salary ranges. Store trend snapshots in the database. Surface the most relevant trend for each user's role in their daily briefing.

**Conversational AI Layer**
Build the full Claude-powered conversation handler. Design the system prompt that gives Claude awareness of the user's profile, tracked applications, recent jobs, and conversation history. Build the intent router that identifies whether a user message is a job search query, an application update, a reminder request, a market question, or general conversation. Ensure Claude's responses are formatted for WhatsApp — concise, mobile-friendly, and actionable.

**Web Dashboard — Full Build**
Build all dashboard pages — home overview, job listings browser with filters, application tracker (Kanban board), settings and preferences, company watchlist manager, and notification history. Ensure full mobile responsiveness. Connect all pages to the Next.js API routes built in previous steps.

**Notification Preferences & Controls**
Build the settings system for notification control — briefing time, which sections to include, notification frequency for reminders, opt-out for specific job types. Expose this in both the dashboard and via WhatsApp commands ("stop sending me trends" or "change my briefing to 8am").

**Testing, QA & Optimization**
End-to-end testing of the full daily briefing flow. Load test the scraping pipeline with multiple users. Test WhatsApp message formatting across Android and iOS. Optimize Claude prompts for response quality and latency. Optimize database queries with proper indexing. Test timezone handling for users across India and other regions.

**Launch & Monitoring**
Set up error tracking with Sentry. Add logging for all scraping runs, message dispatches, and AI responses. Build a simple internal admin view to monitor system health — scraper status, message delivery rates, active users. Deploy to production, register the WhatsApp Business number officially, and go live.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend & Backend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase + Prisma ORM |
| Cache & Queue | Redis via Upstash + BullMQ |
| Auth | NextAuth.js (Google + LinkedIn OAuth) |
| WhatsApp | Twilio WhatsApp API or Meta Cloud API |
| AI Brain | Claude API (claude-sonnet-4-6) |
| Scraping | Playwright + Cheerio + JSearch API |
| Cron / Scheduling | Vercel Cron Jobs |
| Hosting | Vercel (Next.js) + DigitalOcean (Scraper VM) |

---