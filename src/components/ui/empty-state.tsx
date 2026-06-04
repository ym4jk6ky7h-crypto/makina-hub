import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateAction = {
  label: string;
  href: string;
  variant?: "default" | "outline";
};

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  hint?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actions = [],
  hint,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={
        compact
          ? "rounded-xl border border-dashed border-white/15 bg-card/40 px-4 py-8 text-center"
          : "glass-card mx-auto max-w-lg rounded-2xl p-8 text-center sm:p-10"
      }
    >
      <Icon
        className={
          compact
            ? "mx-auto mb-3 h-8 w-8 text-muted-foreground/70"
            : "mx-auto mb-4 h-10 w-10 text-makina-pink/80"
        }
      />
      <h2 className={compact ? "text-base font-semibold" : "text-xl font-bold"}>
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {hint && <div className="mt-4 text-sm text-muted-foreground">{hint}</div>}
      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant={action.variant === "outline" ? "outline" : "makina"}
                size="sm"
              >
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
