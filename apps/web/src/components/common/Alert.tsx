import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

const variants = {
  info: {
    container: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-800 dark:text-blue-300",
    text: "text-blue-700 dark:text-blue-400",
    Icon: Info,
  },
  success: {
    container: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-800 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-400",
    Icon: CheckCircle2,
  },
  warning: {
    container: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400",
    title: "text-amber-800 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-400",
    Icon: AlertTriangle,
  },
  error: {
    container: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-800 dark:text-red-300",
    text: "text-red-700 dark:text-red-400",
    Icon: AlertCircle,
  },
};

interface AlertProps {
  variant?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({ variant = "info", title, children, dismissible, onDismiss, className }: AlertProps) {
  const v = variants[variant];

  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", v.container, className)} role="alert">
      <v.Icon className={cn("h-5 w-5 shrink-0 mt-0.5", v.icon)} />
      <div className="flex-1 min-w-0">
        {title && <p className={cn("text-sm font-semibold", v.title)}>{title}</p>}
        <div className={cn("text-sm", title && "mt-1", v.text)}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className={cn("shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5", v.icon)}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
