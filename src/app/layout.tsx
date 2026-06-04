import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo/metadata";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = buildMetadata({
  title: "Inicio",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = organizationJsonLd();

  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} min-h-screen font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
