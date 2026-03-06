import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({ value, onValueChange, options, placeholder = "Select...", label, error, disabled, className }: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            "inline-flex h-10 items-center justify-between rounded-lg border px-3 text-sm",
            "bg-[var(--bg-primary)] text-[var(--text-primary)]",
            "focus:border-[var(--border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[placeholder]:text-[var(--text-muted)]",
            error ? "border-red-500" : "border-[var(--border-default)]"
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 overflow-hidden rounded-lg border bg-[var(--bg-primary)] shadow-lg animate-slide-down"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex h-9 cursor-pointer select-none items-center rounded-md pl-8 pr-3 text-sm",
                    "text-[var(--text-primary)] outline-none",
                    "data-[highlighted]:bg-[var(--bg-tertiary)]",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2">
                    <Check className="h-4 w-4 text-brand-600" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
    </div>
  );
}
