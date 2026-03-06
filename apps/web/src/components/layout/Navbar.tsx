import { Link } from "react-router-dom";
import { Bell, Menu, Moon, Sun, Globe } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { Button } from "@/components/common/Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/cn";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { resolvedTheme, setTheme } = useThemeStore();

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-[var(--bg-primary)]/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              SF
            </div>
            <span className="hidden text-lg font-bold text-[var(--text-primary)] sm:inline">SignForge</span>
          </Link>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" aria-label="Language">
            <Globe className="h-5 w-5" />
          </Button>

          {isAuthenticated && (
            <>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-medium text-white">
                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className={cn(
                      "z-50 min-w-[200px] rounded-lg border bg-[var(--bg-primary)] p-1 shadow-lg",
                      "data-[state=open]:animate-slide-down"
                    )}
                    sideOffset={8}
                    align="end"
                  >
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium text-[var(--text-primary)]">{user?.fullName}</p>
                      <p className="text-[var(--text-muted)]">{user?.email}</p>
                    </div>
                    <DropdownMenu.Separator className="my-1 h-px bg-[var(--border-default)]" />
                    <DropdownMenu.Item asChild>
                      <Link
                        to="/settings"
                        className="block rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                      >
                        Settings
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={logout}
                      className="rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                    >
                      Sign out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
