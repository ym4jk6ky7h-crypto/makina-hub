import { Calendar, Headphones, Mic2, ShoppingBag } from "lucide-react";
import type { HomeStats } from "@/services/stats.service";

type HomeStatsBarProps = {
  stats: HomeStats;
};

export function HomeStatsBar({ stats }: HomeStatsBarProps) {
  const items = [
    { value: stats.artists, label: "Artistas", icon: Mic2 },
    {
      value: stats.eventsThisMonth,
      label: "Eventos este mes",
      icon: Calendar,
    },
    { value: stats.eventsUpcoming, label: "Próximos", icon: Calendar },
    { value: stats.releases, label: "Novedades", icon: ShoppingBag },
    { value: stats.sessions, label: "Sesiones", icon: Headphones },
  ];

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
      {items.map(({ value, label, icon: Icon }) => (
        <div
          key={label}
          className="glass-card flex flex-col items-center rounded-xl px-3 py-4 text-center sm:px-4"
        >
          <Icon className="mb-1 h-4 w-4 text-makina-pink" />
          <span className="font-display text-2xl font-bold sm:text-3xl">{value}</span>
          <span className="text-[11px] leading-tight text-muted-foreground sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
