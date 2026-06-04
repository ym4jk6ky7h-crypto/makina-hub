import Link from "next/link";
import { cn } from "@/lib/utils";

type HomeSectionEmptyProps = {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function HomeSectionEmpty({
  message,
  actionLabel,
  actionHref,
  className,
}: HomeSectionEmptyProps) {
  return (
    <p
      className={cn(
        "rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-center text-sm text-muted-foreground",
        className
      )}
    >
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
  );
}
