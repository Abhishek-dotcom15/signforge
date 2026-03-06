import { apiClient } from "@/lib/api-client";
import type { Sign, TranslationResponse, GlossMapping } from "@/types";

interface RawTranslateResult {
  translation_id?: string;
  glosses: string[];
  sigml_urls: string[];
  word_mapping: { word: string; gloss: string; confidence: number }[];
  confidence: number;
  detected_lang?: string;
  fallback_used?: boolean;
  signing_duration_sec?: number;
  cached?: boolean;
}

interface PaginatedSigns {
  data: Sign[];
  total: number;
  page: number;
  pages: number;
}

function mapTranslateResult(raw: RawTranslateResult, sourceText: string): TranslationResponse {
  return {
    translationId: raw.translation_id || "",
    sourceText,
    detectedLang: raw.detected_lang || "en",
    glosses: raw.glosses,
    sigmlUrls: raw.sigml_urls,
    wordToGlossMap: raw.word_mapping.map((m, i): GlossMapping => ({
      word: m.word,
      index: i,
      gloss: m.gloss,
      mapped: m.confidence > 0.5,
    })),
    confidence: raw.confidence,
    fallbackUsed: raw.fallback_used ?? false,
    signingDurationSec: raw.signing_duration_sec ?? raw.glosses.length * 0.8,
    cached: raw.cached ?? false,
  };
}

export const translateApi = {
  translate: async (text: string, sourceLang = "en"): Promise<TranslationResponse> => {
    const { data } = await apiClient.post<RawTranslateResult>("/translate", { text, sourceLang });
    return mapTranslateResult(data, text);
  },

  batchTranslate: async (sentences: string[]) => {
    const { data } = await apiClient.post<{ results: RawTranslateResult[] }>("/translate/batch", { sentences });
    return data.results.map((r, i) => mapTranslateResult(r, sentences[i] ?? ""));
  },
};

export const signsApi = {
  list: async (params: { page?: number; perPage?: number; q?: string; category?: string; difficulty?: string }) => {
    const { data } = await apiClient.get<PaginatedSigns>("/signs", { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<Sign>(`/signs/${id}`);
    return data;
  },

  wordOfTheDay: async () => {
    const { data } = await apiClient.get<Sign>("/signs/word-of-the-day");
    return data;
  },

  glossary: async (letter: string) => {
    const { data } = await apiClient.get<{ letter: string; signs: Sign[] }>("/signs/glossary", {
      params: { letter },
    });
    return data;
  },
};
