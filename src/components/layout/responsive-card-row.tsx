import { cn } from "@/lib/utils";

type ResponsiveCardRowProps = {
  children: React.ReactNode;
  desktopGrid?: string;
  className?: string;
};

export function ResponsiveCardRow({
  children,
  desktopGrid = "lg:grid lg:grid-cols-4 lg:gap-4",
  className,
}: ResponsiveCardRowProps) {
  return (
    <div
      className={cn(
        "scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory",
        desktopGrid,
        "lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Envuelve cada card dentro de ResponsiveCardRow */
export function CarouselItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[min(78vw,260px)] shrink-0 snap-start lg:w-auto lg:min-w-0",
        className
      )}
    >
      {children}
    </div>
  );
}
