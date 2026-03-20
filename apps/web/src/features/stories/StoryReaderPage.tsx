import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Eye, Clock, List } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Spinner } from "@/components/common/Spinner";
import { ErrorState } from "@/components/common/ErrorState";
import { storiesApi } from "./api/stories-api";
import type { StoryProgress } from "@/types";

const themeColors: Record<string, "green" | "blue" | "purple" | "red" | "amber"> = {
  animal: "green",
  human: "blue",
  wisdom: "purple",
  sacrifice: "red",
  karmic: "amber",
};

const difficultyColors: Record<string, "green" | "amber" | "red"> = {
  beginner: "green",
  intermediate: "amber",
  advanced: "red",
};

export function StoryReaderPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showChapterList, setShowChapterList] = useState(false);

  // Fetch story details
  const {
    data: story,
    isLoading: storyLoading,
    error: storyError,
    refetch: refetchStory,
  } = useQuery({
    queryKey: ["story", id],
    queryFn: () => storiesApi.get(id!),
    enabled: !!id,
  });

  // Fetch current chapter content
  const {
    data: chapter,
    isLoading: chapterLoading,
    error: chapterError,
    refetch: refetchChapter,
  } = useQuery({
    queryKey: ["story-chapter", id, currentChapter],
    queryFn: () => storiesApi.getChapter(id!, currentChapter),
    enabled: !!id,
  });

  // Fetch user progress (silently fails if not authenticated)
  const { data: progress } = useQuery({
    queryKey: ["story-progress", id],
    queryFn: () => storiesApi.getProgress(id!),
    enabled: !!id,
    retry: false,
  });

  // Update progress mutation
  const updateProgress = useMutation({
    mutationFn: (data: Partial<StoryProgress>) =>
      storiesApi.updateProgress(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-progress", id] });
    },
  });

  // Track progress when chapter changes
  useEffect(() => {
    if (!story || !id) return;
    const totalChapters = story.chapters?.length || story.chapterCount;
    if (totalChapters === 0) return;

    const completionPct = Math.round((currentChapter / totalChapters) * 100);
    const status: StoryProgress["status"] = currentChapter >= totalChapters ? "completed" : "in_progress";

    updateProgress.mutate({
      currentChapter,
      status,
      completionPct,
    });
  }, [currentChapter, id, story]);

  // Resume from saved progress on initial load
  useEffect(() => {
    if (progress && progress.status !== "not_started" && progress.currentChapter > 1) {
      setCurrentChapter(progress.currentChapter);
    }
  }, [progress]);

  const navigateChapter = (num: number) => {
    setCurrentChapter(num);
    setShowChapterList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (storyLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (storyError || !story) {
    return <ErrorState onRetry={() => refetchStory()} />;
  }

  const totalChapters = story.chapters?.length || story.chapterCount;
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button */}
      <Link
        to="/stories"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Stories
      </Link>

      {/* Story header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color={themeColors[story.theme] || "gray"} size="md">
            {story.theme}
          </Badge>
          <Badge color={difficultyColors[story.difficulty] || "gray"} size="md">
            {story.difficulty}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Eye className="h-3.5 w-3.5" /> {story.viewCount} views
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{story.titleEn}</h1>
        {story.titleHi && (
          <p className="text-lg font-hindi text-[var(--text-secondary)]">{story.titleHi}</p>
        )}
        {story.summaryEn && (
          <p className="text-sm text-[var(--text-secondary)]">{story.summaryEn}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {story.durationMin || "?"} min
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> {totalChapters} chapters
          </span>
        </div>
      </div>

      {/* Chapter navigation bar */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              icon={<List className="h-4 w-4" />}
              onClick={() => setShowChapterList(!showChapterList)}
            >
              Chapters
            </Button>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Chapter {currentChapter} of {totalChapters}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="h-4 w-4" />}
              disabled={!hasPrev}
              onClick={() => navigateChapter(currentChapter - 1)}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconRight={<ChevronRight className="h-4 w-4" />}
              disabled={!hasNext}
              onClick={() => navigateChapter(currentChapter + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Chapter list dropdown */}
        {showChapterList && (
          <div className="mt-3 border-t border-[var(--border-primary)] pt-3">
            <ul className="space-y-1">
              {story.chapters.map((ch) => (
                <li key={ch.chapterNum}>
                  <button
                    onClick={() => navigateChapter(ch.chapterNum)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      ch.chapterNum === currentChapter
                        ? "bg-brand-600 text-white"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                    }`}
                  >
                    <span className="font-medium">Chapter {ch.chapterNum}</span>
                    {ch.titleEn && (
                      <span className="ml-2 text-inherit opacity-80">— {ch.titleEn}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Chapter content */}
      {chapterLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : chapterError ? (
        <ErrorState onRetry={() => refetchChapter()} />
      ) : chapter ? (
        <div className="space-y-6">
          {/* Chapter title */}
          {chapter.titleEn && (
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {chapter.titleEn}
            </h2>
          )}

          {/* English content */}
          <Card padding="md">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line text-[var(--text-primary)] leading-relaxed">
                {chapter.contentEn}
              </p>
            </div>
          </Card>

          {/* Hindi content */}
          {chapter.contentHi && (
            <Card padding="md">
              <h3 className="mb-2 text-sm font-medium text-[var(--text-muted)]">Hindi</h3>
              <p className="whitespace-pre-line font-hindi text-[var(--text-secondary)] leading-relaxed">
                {chapter.contentHi}
              </p>
            </Card>
          )}

          {/* ISL Glosses */}
          {chapter.islGlosses && (
            <Card padding="md" className="border-l-4 border-l-brand-500">
              <h3 className="mb-3 text-sm font-medium text-[var(--text-muted)]">
                ISL Gloss Notation
              </h3>
              <div className="flex flex-wrap gap-2">
                {chapter.islGlosses.split(/\s+/).map((gloss, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-md bg-brand-50 px-2.5 py-1 text-sm font-mono font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                  >
                    {gloss}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Bottom chapter navigation */}
          <div className="flex items-center justify-between border-t border-[var(--border-primary)] pt-6">
            <div>
              {hasPrev && (
                <Button
                  variant="secondary"
                  icon={<ChevronLeft className="h-4 w-4" />}
                  onClick={() => navigateChapter(currentChapter - 1)}
                >
                  Previous Chapter
                </Button>
              )}
            </div>
            <div>
              {hasNext ? (
                <Button
                  variant="primary"
                  iconRight={<ChevronRight className="h-4 w-4" />}
                  onClick={() => navigateChapter(currentChapter + 1)}
                >
                  Next Chapter
                </Button>
              ) : (
                <Link to="/stories">
                  <Button variant="success">Finished Reading</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
