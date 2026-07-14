import type { Metadata } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "BugPress - Cobertura Técnica de Falhas, Bugs e Vulnerabilidades",
  description: "O maior portal jornalístico independente especializado em depuração de sistemas, incidentes de infraestrutura, brechas de segurança cibernética e tecnologia de ponta.",
  keywords: [
    "bugpress",
    "falhas de segurança",
    "incidentes de ti",
    "cybersecurity",
    "desenvolvimento de software",
    "bugs de sistemas",
    "tecnologia de software",
    "brasil ti"
  ],
  authors: [{ name: "Redação BugPress", url: "https://bugpress.com.br" }],
  creator: "BugPress Team",
  publisher: "BugPress Publicações",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  other: {
    // Metadados Geográficos (SEO Local)
    "geo.position": "-23.55052; -46.633308",
    "geo.region": "BR-SP",
    "geo.placename": "São Paulo",
    "ICBM": "-23.55052, -46.633308",
    // Otimização para Motores Generativos (GEO) e Crawlers de IA
    "ai-agent-index": "index, follow",
    "ai-agent-knowledge-graph": "enabled",
    "dc.publisher": "BugPress Publicações",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#fafafa] font-sans">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
