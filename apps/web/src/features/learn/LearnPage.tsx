import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Play, CheckCircle2, Lock, Trophy, Star, Target } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Progress } from "@/components/common/Progress";
import { Stat } from "@/components/common/Stat";
import { Spinner } from "@/components/common/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { learnApi } from "./api/learn-api";

const difficultyColors = {
  beginner: "green" as const,
  intermediate: "amber" as const,
  advanced: "red" as const,
};

const categories = ["all", "alphabet", "numbers", "greetings", "daily", "grammar"] as const;

export function LearnPage() {
  const [category, setCategory] = useState<string>("all");

  const { data: modules, isLoading, error, refetch } = useQuery({
    queryKey: ["learn-modules"],
    queryFn: () => learnApi.getModules(),
  });

  const { data: stats } = useQuery({
    queryKey: ["learn-stats"],
    queryFn: () => learnApi.getStats(),
  });

  const filtered = modules?.filter(
    (m) => category === "all" || m.category === category,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Learn ISL</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Master Indian Sign Language at your own pace
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Signs Learned" value={stats?.signsLearned ?? "--"} icon={<Star className="h-5 w-5" />} />
        <Stat label="Lessons Done" value={stats?.completedLessons ?? "--"} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Stat label="Day Streak" value={stats?.streakDays ?? "--"} icon={<Trophy className="h-5 w-5" />} />
        <Stat
          label="Overall Progress"
          value={stats ? `${Math.round((stats.completedLessons / Math.max(stats.totalLessons, 1)) * 100)}%` : "--"}
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              category === c
                ? "bg-brand-600 text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Modules */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !filtered?.length ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title="No modules found"
          description="Learning modules will appear here once available."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mod) => {
            const pct = mod.lessonsTotal > 0
              ? Math.round((mod.lessonsCompleted / mod.lessonsTotal) * 100)
              : 0;
            const completed = pct === 100;

            return (
              <Card
                key={mod.id}
                hoverable={!mod.isLocked}
                padding="md"
                className={mod.isLocked ? "opacity-60" : ""}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      completed
                        ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                        : mod.isLocked
                          ? "bg-gray-100 text-gray-400 dark:bg-gray-800"
                          : "bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
                    }`}>
                      {mod.isLocked ? (
                        <Lock className="h-5 w-5" />
                      ) : completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="!text-base">{mod.title}</CardTitle>
                      <Badge color={difficultyColors[mod.difficulty]} size="sm" className="mt-1">
                        {mod.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">{mod.description}</CardDescription>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
                    <span>{mod.lessonsCompleted}/{mod.lessonsTotal} lessons</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress
                    value={mod.lessonsCompleted}
                    max={mod.lessonsTotal}
                    size="sm"
                    color={completed ? "green" : "brand"}
                  />
                </div>
                {!mod.isLocked && !completed && (
                  <Button size="sm" variant="secondary" className="mt-4 w-full">
                    {mod.lessonsCompleted > 0 ? "Continue" : "Start"}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
