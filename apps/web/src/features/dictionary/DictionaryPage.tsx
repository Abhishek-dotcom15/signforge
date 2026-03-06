import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, BookA, Volume2 } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Pagination } from "@/components/common/Pagination";
import { Spinner } from "@/components/common/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { useDebounce } from "@/hooks/useDebounce";
import { signsApi } from "@/features/communication/api/translate-api";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const difficultyColor = { beginner: "green" as const, intermediate: "amber" as const, advanced: "red" as const };

export function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["signs", debouncedSearch, page],
    queryFn: () => signsApi.list({ q: debouncedSearch || undefined, page, perPage: 20 }),
  });

  const { data: glossaryData } = useQuery({
    queryKey: ["glossary", activeLetter],
    queryFn: () => signsApi.glossary(activeLetter!),
    enabled: !!activeLetter,
  });

  const { data: wotd } = useQuery({
    queryKey: ["word-of-the-day"],
    queryFn: () => signsApi.wordOfTheDay(),
    staleTime: 1000 * 60 * 60,
  });

  const signs = activeLetter ? glossaryData?.signs || [] : data?.data || [];
  const totalPages = activeLetter ? 1 : data?.pages || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">ISL Dictionary</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Browse and search 5,000+ Indian Sign Language signs
        </p>
      </div>

      {/* Word of the Day */}
      {wotd && (
        <Card className="bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 border-brand-200 dark:border-brand-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Volume2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wide">Word of the Day</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{wotd.englishWord}</p>
              <p className="text-sm text-[var(--text-secondary)]">Gloss: {wotd.gloss}</p>
            </div>
            <Badge color={difficultyColor[wotd.difficulty]} className="ml-auto">{wotd.difficulty}</Badge>
          </div>
        </Card>
      )}

      {/* Search + Alphabet filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); setPage(1); }}
            placeholder="Search signs by word or gloss..."
            className="h-10 w-full rounded-lg border bg-[var(--bg-primary)] pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)]"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => { setActiveLetter(activeLetter === letter ? null : letter); setSearch(""); }}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                activeLetter === letter
                  ? "bg-brand-600 text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : signs.length === 0 ? (
        <EmptyState
          icon={<BookA className="h-8 w-8" />}
          title="No signs found"
          description={search ? `No results for "${search}". Try a different term.` : "No signs available for this filter."}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {signs.map((sign) => (
              <Card key={sign.id} hoverable padding="md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{sign.englishWord}</h3>
                    {sign.hindiWord && (
                      <p className="text-sm font-hindi text-[var(--text-secondary)]">{sign.hindiWord}</p>
                    )}
                  </div>
                  <Badge color={difficultyColor[sign.difficulty]} size="sm">{sign.difficulty}</Badge>
                </div>
                <p className="mt-2 text-xs font-mono text-[var(--text-muted)]">GLOSS: {sign.gloss}</p>
                {sign.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {sign.categories.map((c) => (
                      <Badge key={c} color="gray" size="sm">{c}</Badge>
                    ))}
                  </div>
                )}
                {sign.handshapeDesc && (
                  <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2">{sign.handshapeDesc}</p>
                )}
              </Card>
            ))}
          </div>
          {!activeLetter && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />}
        </>
      )}
    </div>
  );
}
