import { useMutation } from "@tanstack/react-query";
import { translateApi } from "../api/translate-api";

export function useTranslation() {
  return useMutation({
    mutationFn: (data: { text: string; sourceLang?: string; speed?: number }) =>
      translateApi.translate(data.text, data.sourceLang),
  });
}
