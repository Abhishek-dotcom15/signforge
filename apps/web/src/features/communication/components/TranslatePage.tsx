import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { ISLAvatar } from "@/components/avatar/ISLAvatar";
import { useTranslation } from "../hooks/useTranslation";
import { Languages, Play, Pause, RotateCcw, Maximize2, Volume2 } from "lucide-react";
import type { TranslationResponse } from "@/types";

export function TranslatePage() {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState<"auto" | "en" | "hi">("auto");
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const translation = useTranslation();

  const handleTranslate = () => {
    if (!text.trim()) return;
    translation.mutate(
      { text, sourceLang, speed },
      {
        onSuccess: (data) => {
          setResult(data);
          setIsPlaying(true); // Auto-play after translation
        },
      }
    );
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">ISL Translation</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Type or paste text to translate into Indian Sign Language
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Panel */}
        <Card padding="lg">
          <CardTitle>Input Text</CardTitle>

          <div className="mt-3 flex items-center gap-2">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as "auto" | "en" | "hi")}
              className="rounded-lg border bg-[var(--bg-secondary)] px-3 py-1.5 text-sm"
            >
              <option value="auto">Auto-detect</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            {result?.detectedLang && (
              <Badge color="blue">Detected: {result.detectedLang.toUpperCase()}</Badge>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            maxLength={2000}
            rows={8}
            className="mt-3 w-full resize-none rounded-lg border bg-[var(--bg-secondary)] p-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)]"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              {wordCount} words | {charCount}/2000 chars
            </span>
            {result && <span>Est. {result.signingDurationSec.toFixed(1)}s signing time</span>}
          </div>

          <Button
            className="mt-4 w-full"
            onClick={handleTranslate}
            loading={translation.isPending}
            disabled={!text.trim()}
            icon={<Languages className="h-4 w-4" />}
          >
            Translate to ISL
          </Button>
        </Card>

        {/* Avatar Panel */}
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <CardTitle>ISL Avatar</CardTitle>
            {result && (
              <Badge color={result.confidence >= 0.8 ? "green" : result.confidence >= 0.6 ? "amber" : "red"}>
                {(result.confidence * 100).toFixed(0)}% confidence
              </Badge>
            )}
          </div>

          {/* Avatar viewport */}
          <div className="mt-3 flex aspect-video items-center justify-center rounded-lg bg-[var(--bg-tertiary)] overflow-hidden p-4">
            <ISLAvatar
              glosses={result?.glosses ?? []}
              isPlaying={isPlaying}
              speed={speed}
              onGlossChange={(_idx) => {
                // could highlight word mapping in future
              }}
              onComplete={() => setIsPlaying(false)}
              className="h-full w-full"
            />
          </div>

          {/* Playback controls */}
          {result && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Rewind"
                  onClick={() => { setIsPlaying(false); setTimeout(() => setIsPlaying(true), 50); }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Fullscreen">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Audio">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">Speed:</span>
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      speed === s
                        ? "bg-brand-600 text-white"
                        : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gloss word map */}
          {result && (
            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">WORD MAPPING</p>
              <div className="flex flex-wrap gap-1.5">
                {result.wordToGlossMap.map((m, i) => (
                  <span
                    key={i}
                    className={`rounded-md px-2 py-1 text-xs font-mono ${
                      m.mapped
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    }`}
                  >
                    {m.word} → {m.gloss}
                  </span>
                ))}
              </div>
              {result.fallbackUsed && (
                <p className="mt-2 text-xs text-amber-600">
                  Some words used fallback translation (fingerspelling or rule-based parser)
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
