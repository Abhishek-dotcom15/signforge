import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import {
  MessageSquare, BookOpen, Code, Shield, GraduationCap, Globe,
  ArrowRight, CheckCircle2, Star, Users, Zap, Lock,
} from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { Moon, Sun } from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Real-time ISL Translation",
    desc: "Convert English or Hindi text to Indian Sign Language with a 3D avatar powered by SiGML.",
    color: "bg-blue-500",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Jataka Tales Library",
    desc: "50+ culturally rich stories with chapter-by-chapter ISL narration and adaptive quizzes.",
    color: "bg-purple-500",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Developer SDK & API",
    desc: "RESTful API with NPM and Python SDKs. Integrate ISL translation into any application.",
    color: "bg-orange-500",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Accessibility Auditor",
    desc: "Scan any website for WCAG 2.2 compliance and ISL coverage. Get actionable recommendations.",
    color: "bg-cyan-500",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Educator Dashboard",
    desc: "Create classrooms, assign ISL learning tasks, and track student progress in real-time.",
    color: "bg-pink-500",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Bilingual Support",
    desc: "Full English and Hindi interface. Auto-detect language and translate seamlessly.",
    color: "bg-emerald-500",
  },
];

const stats = [
  { value: "5,000+", label: "ISL Signs" },
  { value: "50+", label: "Jataka Tales" },
  { value: "95%", label: "Translation Accuracy" },
  { value: "<200ms", label: "API Response" },
];

export function LandingPage() {
  const { resolvedTheme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-[var(--bg-primary)]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              SF
            </div>
            <span className="text-lg font-bold text-[var(--text-primary)]">SignForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-content px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-24 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-[var(--bg-secondary)] px-4 py-1.5 text-sm text-[var(--text-secondary)]">
            <Star className="h-4 w-4 text-accent-500" />
            AI-powered Indian Sign Language Platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-display">
            Bridge Communication with{" "}
            <span className="text-gradient">Indian Sign Language</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-secondary)] sm:text-xl">
            Translate text to ISL in real-time, learn through interactive stories,
            and build accessible applications with our developer API.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" iconRight={<ArrowRight className="h-5 w-5" />}>
                Start for free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" icon={<Code className="h-5 w-5" />}>
                View API Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-[var(--bg-secondary)]">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-[var(--text-primary)]">{s.value}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Everything you need for ISL communication
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            A complete platform for learners, educators, developers, and organizations.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-[var(--bg-primary)] p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-content px-4 py-20 text-center sm:px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--text-secondary)]">
            Join thousands of users making communication accessible for the Deaf community.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Free tier available
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Zap className="h-4 w-4 text-amber-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Lock className="h-4 w-4 text-blue-500" />
              Enterprise-ready security
            </div>
          </div>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg" iconRight={<ArrowRight className="h-5 w-5" />}>
              Create your account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">SF</div>
                <span className="font-bold text-[var(--text-primary)]">SignForge</span>
              </div>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                AI-powered Indian Sign Language platform for accessible communication.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <li><Link to="/translate" className="hover:text-[var(--text-primary)]">Translate</Link></li>
                <li><Link to="/dictionary" className="hover:text-[var(--text-primary)]">Dictionary</Link></li>
                <li><Link to="/stories" className="hover:text-[var(--text-primary)]">Stories</Link></li>
                <li><Link to="/developer" className="hover:text-[var(--text-primary)]">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Resources</h4>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <li><a href="#" className="hover:text-[var(--text-primary)]">Documentation</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)]">API Reference</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)]">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <li><a href="#" className="hover:text-[var(--text-primary)]">About</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)]">Privacy</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)]">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} SignForge. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Users className="h-4 w-4" />
              Built for accessibility
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
