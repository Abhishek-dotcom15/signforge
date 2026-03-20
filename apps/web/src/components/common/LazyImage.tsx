import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Skeleton } from "./Skeleton";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Fallback element or URL shown when the image fails to load */
  fallback?: React.ReactNode;
}

export function LazyImage({
  className,
  alt,
  fallback,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  if (status === "error") {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-xs text-[var(--text-muted)]",
          className,
        )}
        role="img"
        aria-label={alt ?? "Image failed to load"}
      >
        {alt || "Image"}
      </div>
    );
  }

  return (
    <div className="relative">
      {status === "loading" && (
        <Skeleton className={cn("absolute inset-0", className)} />
      )}
      <img
        {...props}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          status === "loading" ? "invisible" : "visible",
          className,
        )}
        onLoad={(e) => {
          setStatus("loaded");
          onLoad?.(e);
        }}
        onError={(e) => {
          setStatus("error");
          onError?.(e);
        }}
      />
    </div>
  );
}
