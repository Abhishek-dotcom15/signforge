import { cn } from "@/lib/cn";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatProps {
  label: string;
  value: string | number;
  change?: { value: number; label?: string };
  icon?: React.ReactNode;
  className?: string;
}

export function Stat({ label, value, change, icon, className }: StatProps) {
  const isPositive = change && change.value >= 0;

  return (
    <div className={cn("rounded-xl border bg-[var(--bg-primary)] p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
            {icon}
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      {change && (
        <div className="mt-1 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span
            className={cn("text-xs font-medium", isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}
          >
            {isPositive ? "+" : ""}
            {change.value}%
          </span>
          {change.label && <span className="text-xs text-[var(--text-muted)]">{change.label}</span>}
        </div>
      )}
    </div>
  );
}
