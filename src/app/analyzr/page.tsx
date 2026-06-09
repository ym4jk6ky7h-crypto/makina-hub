import { redirect } from "next/navigation";

/** Ruta antigua → Analyzr Vinyl */
export default function AnalyzrLegacyRedirect() {
  redirect("/analyzr-vinyl");
}
