import { NavLink } from "react-router-dom";
import {
  MessageSquare,
  Book,
  BookOpen,
  Code,
  GraduationCap,
  Shield,
  LayoutDashboard,
  Settings,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Translate", path: "/translate", icon: <MessageSquare className="h-5 w-5" /> },
  { label: "Dictionary", path: "/dictionary", icon: <Search className="h-5 w-5" /> },
  { label: "Stories", path: "/stories", icon: <BookOpen className="h-5 w-5" /> },
  { label: "Learn", path: "/learn", icon: <Book className="h-5 w-5" /> },
  {
    label: "Developer",
    path: "/developer",
    icon: <Code className="h-5 w-5" />,
    roles: ["developer", "super_admin"],
  },
  {
    label: "Classroom",
    path: "/classroom",
    icon: <GraduationCap className="h-5 w-5" />,
    roles: ["educator", "student", "institution_admin", "super_admin"],
  },
  {
    label: "Auditor",
    path: "/auditor",
    icon: <Shield className="h-5 w-5" />,
    roles: ["developer", "super_admin"],
  },
  {
    label: "Admin",
    path: "/admin",
    icon: <Settings className="h-5 w-5" />,
    roles: ["super_admin", "institution_admin"],
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuthStore();
  const userRoles = user?.roles || [];

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.some((r) => userRoles.includes(r))
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-[var(--bg-primary)] transition-transform duration-200",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-end p-2 lg:hidden">
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-[var(--bg-tertiary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Main navigation">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
