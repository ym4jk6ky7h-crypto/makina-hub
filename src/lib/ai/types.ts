/**
 * Tipos para la futura capa de IA de Makina Hub.
 * @see /agents — agentes de recopilación (eventos, artistas, etc.)
 */

export type AIAgentRole =
  | "search-assistant"
  | "event-scraper"
  | "artist-enricher"
  | "track-matcher";

export interface AIQueryRequest {
  query: string;
  locale?: string;
  maxResults?: number;
}

export interface AIQueryResponse {
  answer: string;
  sources?: { type: string; slug: string; title: string }[];
}

export interface AIAgentContext {
  databaseSnapshot?: string;
  userId?: string;
}
