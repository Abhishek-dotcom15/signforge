import { useEffect, useRef, useState, type RefObject } from "react";

interface UseIntersectionObserverOptions {
  /** IntersectionObserver threshold (0-1). Default: 0 */
  threshold?: number | number[];
  /** Root element for intersection. Default: viewport */
  root?: Element | null;
  /** Root margin (CSS margin string). Default: "0px" */
  rootMargin?: string;
  /** Stop observing after first intersection. Default: false */
  once?: boolean;
}

interface UseIntersectionObserverReturn<T extends Element> {
  ref: RefObject<T | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn<T> {
  const { threshold = 0, root = null, rootMargin = "0px", once = false } = options;
  const ref = useRef<T | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const observerEntry = entries[0];
        if (!observerEntry) return;
        setEntry(observerEntry);
        if (once && observerEntry.isIntersecting) {
          observer.unobserve(node);
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, once]);

  return {
    ref,
    isIntersecting: entry?.isIntersecting ?? false,
    entry,
  };
}
