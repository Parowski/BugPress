"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin and login screens
  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="w-full border-t border-zinc-800 bg-[#070708] py-8 text-zinc-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Geo SEO */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-1 text-sm font-black tracking-tight text-zinc-300">
              <span className="bg-zinc-800 text-brand-primary px-1.5 py-0.2 text-xs font-mono uppercase">
                Bug
              </span>
              <span>PRESS</span>
            </div>
            <p className="text-xs text-zinc-600 text-center md:text-left max-w-xs leading-relaxed">
              Jornalismo técnico e cobertura independente de falhas, vulnerabilidades e tecnologia.
            </p>
          </div>

          {/* Regional Geo SEO & Contact */}
          <div className="flex flex-col items-center md:items-end gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-brand-accent" />
              <span>Redação Central: São Paulo, SP - Brasil</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Mail className="h-3.5 w-3.5" />
              <span>redacao@bugpress.com.br</span>
            </div>
          </div>
        </div>

        <hr className="my-6 border-zinc-900" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-600">
          <p>© {new Date().getFullYear()} BugPress. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Termos de Uso
            </Link>
            <span className="text-zinc-800">|</span>
            <div className="flex items-center gap-1 text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
              <span>Portal Conectado via SSL de Alta Segurança</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
