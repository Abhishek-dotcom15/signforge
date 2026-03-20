import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Eye, Filter } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Pagination } from "@/components/common/Pagination";
import { Spinner } from "@/components/common/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { storiesApi } from "./api/stories-api";

const themes = ["all", "animal", "human", "wisdom", "sacrifice", "karmic"] as const;
const difficulties = ["all", "beginner", "intermediate", "advanced"] as const;
const themeColors: Record<string, string> = {
  animal: "bg-emerald-500",
  human: "bg-blue-500",
  wisdom: "bg-purple-500",
  sacrifice: "bg-rose-500",
  karmic: "bg-amber-500",
};

export function StoriesPage() {
  const [page, setPage] = useState(1);
  const [theme, setTheme] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["stories", page, theme, difficulty],
    queryFn: () =>
      storiesApi.list({
        page,
        perPage: 12,
        theme: theme === "all" ? undefined : theme,
        difficulty: difficulty === "all" ? undefined : difficulty,
      }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Jataka Tales</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Learn ISL through culturally rich Indian stories
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--text-muted)]" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">Theme:</span>
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => { setTheme(t); setPage(1); }}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                theme === t
                  ? "bg-brand-600 text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Level:</span>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setPage(1); }}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                difficulty === d
                  ? "bg-brand-600 text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data?.data.length ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title="No stories yet"
          description="Stories will appear here once they are published."
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((story) => (
              <Link key={story.id} to={`/stories/${story.id}`} className="block">
                <Card hoverable padding="sm" className="overflow-hidden">
                  <div className="relative h-40 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                    {story.thumbnailUrl ? (
                      <img src={story.thumbnailUrl} alt={story.titleEn} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${themeColors[story.theme] || "bg-gray-500"}`}>
                        <BookOpen className="h-7 w-7" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2" color={
                      story.difficulty === "beginner" ? "green" : story.difficulty === "intermediate" ? "amber" : "red"
                    }>
                      {story.difficulty}
                    </Badge>
                  </div>
                  <div className="mt-3 px-1">
                    <CardTitle className="!text-base line-clamp-1">{story.titleEn}</CardTitle>
                    {story.titleHi && (
                      <p className="text-sm font-hindi text-[var(--text-muted)]">{story.titleHi}</p>
                    )}
                    {story.summaryEn && (
                      <CardDescription className="mt-1 line-clamp-2">{story.summaryEn}</CardDescription>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {story.durationMin || "?"} min</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {story.chapterCount} ch.</span>
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {story.viewCount}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <Pagination page={page} totalPages={data.pages} onPageChange={setPage} className="mt-8" />
        </>
      )}
    </div>
  );
}
