import { AlertTriangle, RefreshCw, WifiOff, ShieldX, FileQuestion } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

type ErrorVariant = "generic" | "network" | "forbidden" | "notFound";

const variants: Record<ErrorVariant, { icon: React.ReactNode; title: string; description: string }> = {
  generic: {
    icon: <AlertTriangle className="h-8 w-8" />,
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
  },
  network: {
    icon: <WifiOff className="h-8 w-8" />,
    title: "Connection lost",
    description: "Please check your internet connection and try again.",
  },
  forbidden: {
    icon: <ShieldX className="h-8 w-8" />,
    title: "Access denied",
    description: "You don't have permission to view this content.",
  },
  notFound: {
    icon: <FileQuestion className="h-8 w-8" />,
    title: "Not found",
    description: "The resource you're looking for doesn't exist or has been moved.",
  },
};

interface ErrorStateProps {
  variant?: ErrorVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ variant = "generic", title, description, onRetry, className }: ErrorStateProps) {
  const v = variants[variant];

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400">
        {v.icon}
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title || v.title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">{description || v.description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} icon={<RefreshCw className="h-4 w-4" />} className="mt-6">
          Try again
        </Button>
      )}
    </div>
  );
}
