# Agents (futuro)

Directorio reservado para agentes IA que alimenten Makina Hub:

| Agente | Función |
|--------|---------|
| `event-scraper` | Recopilar eventos remember/mákina |
| `artist-enricher` | Completar biografías y redes |
| `track-matcher` | Vincular temas con YouTube y sellos |
| `session-indexer` | Indexar sesiones y tracklists |

Cada agente debería escribir en Supabase vía `SUPABASE_SERVICE_ROLE_KEY`.

Ver también: `/src/lib/ai` y `/src/services/ai`.
