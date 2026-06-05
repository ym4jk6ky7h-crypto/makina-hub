import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type HomeSectionEmptyProps = {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: LucideIcon;
  className?: string;
};

export function HomeSectionEmpty({
  message,
  actionLabel,
  actionHref,
  icon: Icon,
  className,
}: HomeSectionEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-8 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
          <Icon className="h-6 w-6 text-makina-pink/70" aria-hidden />
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        {message}
        {actionLabel && actionHref && (
          <>
            {" "}
            <Link href={actionHref} className="font-medium text-makina-pink hover:underline">
              {actionLabel}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
