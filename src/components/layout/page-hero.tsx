import Image from "next/image";
import type { ReactNode } from "react";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  image: string;
  badge?: string;
  children?: ReactNode;
};

export function PageHero({
  title,
  subtitle,
  image,
  badge,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover opacity-35"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div className="absolute inset-0 bg-hero-gradient opacity-60" />
      </div>
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        {badge && (
          <span className="mb-4 inline-flex items-center rounded-full border border-makina-pink/40 bg-makina-pink/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-makina-pink">
            {badge}
          </span>
        )}
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
