/**
 * Servicios de IA (futuro).
 *
 * Ejemplo de uso planificado:
 * - askMakina(query) → respuesta con contexto de Supabase
 * - runAgent('event-scraper', { city: 'Valencia' })
 *
 * Por ahora la ruta /api/ai usa OpenAI directamente.
 * Migrar aquí cuando se active la capa de agentes.
 */

export type { AIQueryRequest, AIQueryResponse } from "@/lib/ai/types";

export async function askMakinaPlaceholder(): Promise<never> {
  throw new Error("askMakina no implementado — usar /api/ai temporalmente");
}
