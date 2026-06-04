/** URL de cartel: imagen real o placeholder con el nombre del evento */
export function eventPosterUrl(title: string, imageUrl?: string | null): string {
  const url = imageUrl?.trim();
  if (url) return url;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(title.slice(0, 14))}&size=800&background=1a1a2e&color=e94560&bold=true&format=png`;
}
