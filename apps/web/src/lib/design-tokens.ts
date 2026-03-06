/**
 * SignForge Design Tokens
 * ========================================
 * Mirrors the Figma design system structure.
 * All values here are the single source of truth
 * for spacing, colors, typography, and component specs.
 *
 * FIGMA FILE STRUCTURE:
 *
 * Page 1: Cover & TOC
 * Page 2: Design Tokens
 *   - Colors (brand, accent, semantic, surface)
 *   - Typography scale (display, h1-h6, body, caption)
 *   - Spacing (4px grid, 8px rhythm)
 *   - Elevation (shadow-sm, shadow-md, shadow-lg)
 *   - Border radii (sm=6, md=8, lg=12, xl=16, full)
 *   - Breakpoints (sm=640, md=768, lg=1024, xl=1280)
 *
 * Page 3: Components
 *   Section: Primitives (Button, Input, Badge, Avatar, Tooltip)
 *   Section: Data Display (Card, Table, Stat, List)
 *   Section: Feedback (Toast, Alert, Progress, Spinner)
 *   Section: Overlay (Modal, Dropdown, Sheet, Popover)
 *   Section: Navigation (Tabs, Sidebar, Breadcrumb, Pagination)
 *   Section: Form (Select, Checkbox, Switch, Radio, Textarea, FileUpload)
 *
 * Page 4: Layouts
 *   Frame: AppShell (Navbar + Sidebar + Content)
 *   Frame: AuthLayout (centered card)
 *   Frame: LandingLayout (full-width sections)
 *
 * Page 5: Pages - Landing
 *   Frame: Hero, Features, Pricing, Footer
 *
 * Page 6: Pages - Auth
 *   Frame: Login, Register, ForgotPassword, ResetPassword
 *
 * Page 7: Pages - Dashboard
 *   Frame: Overview, Stats, QuickActions, RecentActivity
 *
 * Page 8: Pages - Core Features
 *   Frame: TranslatePage, DictionaryPage, StoriesPage, LearnPage
 *   Frame: DeveloperPage, ClassroomPage, AuditorPage
 *
 * Page 9: Pages - Settings & Profile
 *   Frame: GeneralSettings, SecuritySettings, AppearanceSettings
 *   Frame: ProfileView, ProfileEdit
 *
 * Page 10: States
 *   Frame: Empty states (no data, first-time)
 *   Frame: Error states (404, 500, offline, permission)
 *   Frame: Loading states (skeleton, spinner, progress)
 *
 * Page 11: Responsive Variants
 *   Frame: Desktop (1280px)
 *   Frame: Tablet (768px)
 *   Frame: Mobile (375px)
 *
 * COMPONENT VARIANTS (Figma Component Properties):
 *   Button: variant(primary|secondary|ghost|danger|success) x size(sm|md|lg|icon) x state(default|hover|active|disabled|loading)
 *   Input: state(default|focus|error|disabled) x hasLabel(true|false)
 *   Card: padding(sm|md|lg) x hoverable(true|false)
 *   Badge: color(blue|green|red|amber|purple|gray) x size(sm|md)
 *   Modal: size(sm|md|lg|full)
 *   Table: density(compact|default|relaxed)
 *   Alert: variant(info|success|warning|error)
 *   Toast: variant(success|error|info|warning)
 *
 * AUTO-LAYOUT:
 *   - All components use Figma auto-layout (maps to flexbox)
 *   - 8px base spacing grid
 *   - Responsive frames use auto-layout with fill/hug
 *   - Cards: vertical auto-layout, padding from token
 *   - Sidebar: vertical auto-layout, 4px gap between items
 *   - Page content: vertical auto-layout, 24px section gap
 */

export const tokens = {
  colors: {
    brand: {
      50: "#EFF6FF",
      100: "#DBEAFE",
      200: "#BFDBFE",
      300: "#93C5FD",
      400: "#60A5FA",
      500: "#3B82F6",
      600: "#2563EB",
      700: "#1D4ED8",
      800: "#1E40AF",
      900: "#1E3A8A",
    },
    accent: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F59E0B",
      600: "#D97706",
    },
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },
  typography: {
    fontFamily: {
      sans: "Inter, system-ui, sans-serif",
      hindi: "Noto Sans Devanagari, sans-serif",
      mono: "JetBrains Mono, Menlo, monospace",
    },
    scale: {
      display: { size: "3rem", lineHeight: 1.1, weight: 800, tracking: "-0.02em" },
      h1: { size: "2.25rem", lineHeight: 1.2, weight: 700, tracking: "-0.02em" },
      h2: { size: "1.875rem", lineHeight: 1.3, weight: 700, tracking: "-0.01em" },
      h3: { size: "1.5rem", lineHeight: 1.4, weight: 600, tracking: "0" },
      h4: { size: "1.25rem", lineHeight: 1.4, weight: 600, tracking: "0" },
      body: { size: "1rem", lineHeight: 1.6, weight: 400, tracking: "0" },
      bodySmall: { size: "0.875rem", lineHeight: 1.5, weight: 400, tracking: "0" },
      caption: { size: "0.75rem", lineHeight: 1.5, weight: 500, tracking: "0.01em" },
    },
  },
  spacing: {
    unit: 4,
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  },
  radii: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
} as const;
