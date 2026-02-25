import Link from "next/link";
import {
  Zap,
  MessageCircle,
  BarChart3,
  Briefcase,
  TrendingUp,
  Bell,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-hero">
      {/* ─── Navbar ──────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--text-primary)]">
              JobPulse
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
              How it Works
            </a>
            <a href="#tech" className="hover:text-[var(--text-primary)] transition-colors">
              Tech Stack
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm rounded-full gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary-light)] text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Job Search on Telegram
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[var(--text-primary)]">
            Your job search,
            <br />
            <span className="gradient-text">delivered daily</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Every morning, get a curated briefing of jobs matched to your
            profile on Telegram. Track applications, prep for interviews, and
            chat with AI — all from the app you already use.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-full gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 animate-pulse-glow"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Telegram Mockup */}
        <div className="max-w-lg mx-auto mt-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--border-default)]">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[var(--text-primary)]">JobPulse</div>
                <div className="text-xs text-[var(--brand-accent)]">● Online</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="chat-bubble-bot p-3">
                <p className="text-sm text-[var(--text-primary)]">
                  ☀️ <strong>Good Morning! Here&apos;s your briefing:</strong>
                </p>
                <div className="mt-2 text-sm text-[var(--text-secondary)] space-y-1">
                  <p>🔍 <strong>3 new jobs</strong> matched your profile</p>
                  <p>📊 <strong>2 apps</strong> in review, 1 interview tomorrow</p>
                  <p>📈 Frontend roles in Bangalore <strong>up 12%</strong></p>
                </div>
              </div>
              <div className="chat-bubble-user ml-auto p-3">
                <p className="text-sm text-white">
                  Show me remote React jobs above 20 LPA
                </p>
              </div>
              <div className="chat-bubble-bot p-3">
                <p className="text-sm text-[var(--text-primary)]">
                  🔍 Found <strong>5 matching jobs:</strong>
                </p>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  <p>1. <strong>Full Stack Engineer</strong> — Razorpay 💰₹25L</p>
                  <p>2. <strong>React Lead</strong> — Zerodha 💰₹30L</p>
                  <p>3. <strong>Frontend Architect</strong> — CRED 💰₹35L</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Everything you need for your job search
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              From discovery to offer, JobPulse handles the busywork so you can
              focus on what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              {
                icon: MessageCircle,
                title: "Telegram AI Chat",
                desc: "Natural conversations to search jobs, track applications, and manage your career — all from Telegram.",
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
              {
                icon: Bell,
                title: "Daily Briefings",
                desc: "Wake up to a curated summary of new job matches, application updates, and interview reminders.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                icon: Briefcase,
                title: "Application Tracker",
                desc: "Kanban-style board to manage every application from Applied through Offer. Never lose track.",
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
              {
                icon: Search,
                title: "Smart Job Matching",
                desc: "Scrapes LinkedIn, Naukri, Indeed, and company pages. AI filters to your skills and preferences.",
                color: "text-cyan-400",
                bg: "bg-cyan-400/10",
              },
              {
                icon: TrendingUp,
                title: "Market Trends",
                desc: "Which roles are hot, salary benchmarks, and skill demand — data-driven insights for smarter decisions.",
                color: "text-amber-400",
                bg: "bg-amber-400/10",
              },
              {
                icon: BarChart3,
                title: "Interview Prep",
                desc: "Automated reminders with prep notes based on the job description. Walk in confident.",
                color: "text-rose-400",
                bg: "bg-rose-400/10",
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-6">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Up and running in 5 minutes
            </h2>
          </div>

          <div className="space-y-6 stagger-children">
            {[
              {
                step: "01",
                title: "Connect on Telegram",
                desc: "Send a message to JobPulse. It walks you through a quick setup — your role, skills, location, and salary range.",
              },
              {
                step: "02",
                title: "Get Your First Briefing",
                desc: "Next morning, you receive your first daily briefing — jobs scraped from LinkedIn, Naukri, Indeed, and your watchlist companies.",
              },
              {
                step: "03",
                title: "Chat, Track, Win",
                desc: "Reply to search jobs, add applications, schedule interviews. Use the web dashboard for a full overview and Kanban board.",
              },
            ].map((item) => (
              <div key={item.step} className="glass-card p-6 flex items-start gap-6">
                <div className="text-4xl font-black gradient-text shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ──────────────────────────── */}
      <section id="tech" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Built with modern tech
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
            {[
              { name: "Next.js 14", icon: Globe },
              { name: "TypeScript", icon: Shield },
              { name: "Claude AI", icon: Sparkles },
              { name: "PostgreSQL", icon: BarChart3 },
              { name: "Prisma ORM", icon: Zap },
              { name: "Tailwind CSS", icon: Sparkles },
              { name: "Redis + BullMQ", icon: TrendingUp },
              { name: "Telegram", icon: MessageCircle },
            ].map((tech) => (
              <div
                key={tech.name}
                className="glass-card p-4 text-center hover:border-[var(--brand-primary)]/30"
              >
                <tech.icon className="w-6 h-6 mx-auto mb-2 text-[var(--brand-primary-light)]" />
                <div className="text-sm font-medium text-[var(--text-primary)]">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 gradient-border">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Ready to supercharge your job search?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 text-lg">
              Stop juggling platforms. Let AI do the heavy lifting while you
              focus on landing your dream role.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-5 h-5" />
              Enter Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────── */}
      <footer className="border-t border-[var(--border-default)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">
              JobPulse
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Built with Next.js, Claude AI & Telegram
          </p>
        </div>
      </footer>
    </div>
  );
}
