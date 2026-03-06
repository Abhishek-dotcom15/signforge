import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, children, className }: TabsProps) {
  return (
    <RadixTabs.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} className={className}>
      <RadixTabs.List className="flex border-b gap-1">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium -mb-px border-b-2 border-transparent",
              "text-[var(--text-muted)] transition-colors",
              "hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]",
              "data-[state=active]:text-brand-600 data-[state=active]:border-brand-600",
              "dark:data-[state=active]:text-brand-400 dark:data-[state=active]:border-brand-400",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            {item.icon}
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  );
}

export function TabContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <RadixTabs.Content value={value} className={cn("mt-4 focus:outline-none", className)}>
      {children}
    </RadixTabs.Content>
  );
}
