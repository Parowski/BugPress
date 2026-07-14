"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getCookieClient } from "@/lib/api";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getCookieClient("token");
    if (!token) {
      setIsAuthenticated(false);
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#09090b]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary mb-3" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          AUTENTICANDO CRONOGRAMA...
        </span>
      </div>
    );
  }

  // Not authenticated fallback
  if (isAuthenticated === false) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#09090b] px-4 text-center">
        <ShieldAlert className="h-10 w-10 text-brand-accent mb-3" />
        <h1 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
          Acesso Não Autorizado
        </h1>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          Redirecionando para a tela de autenticação administrativa...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row overflow-hidden bg-[#09090b]">
      {/* Sidebar de navegação */}
      <Sidebar />

      {/* Conteúdo dinâmico do painel */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#09090b]">
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
