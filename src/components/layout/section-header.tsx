import Link from "next/link";
import { ChevronRight } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  /** Contador opcional junto al título */
  badge?: string;
};

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Ver todo",
  badge,
}: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="section-glow-line mb-6 opacity-60" />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
            {badge && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({badge})
              </span>
            )}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="group flex shrink-0 items-center gap-1 rounded-full border border-makina-pink/30 bg-makina-pink/5 px-4 py-2 text-sm font-medium text-makina-pink transition-all hover:border-makina-pink/50 hover:bg-makina-pink/10"
          >
            {linkLabel}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
