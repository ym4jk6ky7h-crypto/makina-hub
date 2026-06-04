#!/bin/bash
# Publica Makina Hub en Vercel (elige una opción)
set -e
cd "$(dirname "$0")/.."

echo ""
echo "=== Makina Hub — publicar en Vercel ==="
echo ""

if ! npm run build >/dev/null 2>&1; then
  echo "❌ El build falla. Ejecuta: npm run build"
  exit 1
fi
echo "✓ Build OK en tu Mac"
echo ""

echo "Opción 1 (recomendada): subir a GitHub y Vercel despliega solo"
echo "  git push origin main"
echo ""
echo "Opción 2: Vercel CLI (si no tienes Git conectado)"
echo "  npx vercel login"
echo "  npx vercel --prod"
echo ""
read -r -p "¿Hacer git push ahora? (s/n) " R
if [ "$R" = "s" ] || [ "$R" = "S" ]; then
  git push origin main && echo "" && echo "✓ Push hecho. Mira Vercel → Deployments en 2 min."
else
  echo "Cuando quieras: git push origin main"
fi
