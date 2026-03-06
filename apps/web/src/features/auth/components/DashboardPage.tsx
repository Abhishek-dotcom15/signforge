import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Stat } from "@/components/common/Stat";
import { useAuthStore } from "@/stores/auth-store";
import { dashboardApi } from "@/features/dashboard/api/dashboard-api";
import { MessageSquare, BookOpen, Search, Code, GraduationCap, Shield, Languages, Trophy, Star } from "lucide-react";

const quickActions = [
  { label: "Translate Text", path: "/translate", icon: MessageSquare, color: "bg-blue-500", desc: "Text to ISL translation" },
  { label: "Browse Stories", path: "/stories", icon: BookOpen, color: "bg-purple-500", desc: "Jataka Tales library" },
  { label: "ISL Dictionary", path: "/dictionary", icon: Search, color: "bg-emerald-500", desc: "5,000+ ISL signs" },
  { label: "Developer API", path: "/developer", icon: Code, color: "bg-orange-500", desc: "API keys & playground" },
  { label: "Classroom", path: "/classroom", icon: GraduationCap, color: "bg-pink-500", desc: "Classes & assignments" },
  { label: "Audit", path: "/auditor", icon: Shield, color: "bg-cyan-500", desc: "Accessibility scanner" },
];

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.getStats(),
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome back, {user?.displayName || user?.fullName || "User"}
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          What would you like to do today?
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Translations Today" value={stats?.translationsToday ?? "—"} icon={<Languages className="h-5 w-5" />} />
        <Stat label="Signs Learned" value={stats?.signsLearned ?? "—"} icon={<Star className="h-5 w-5" />} />
        <Stat label="Stories Completed" value={stats?.storiesCompleted ?? "—"} icon={<BookOpen className="h-5 w-5" />} />
        <Stat label="Day Streak" value={stats?.streakDays ?? "—"} icon={<Trophy className="h-5 w-5" />} />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path}>
              <Card hoverable className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="!text-base">{action.label}</CardTitle>
                  <CardDescription>{action.desc}</CardDescription>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
