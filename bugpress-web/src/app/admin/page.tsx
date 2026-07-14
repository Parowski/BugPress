"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  Tags,
  Users,
  Plus,
  ArrowUpRight,
  Loader2,
  AlertTriangle,
  Activity
} from "lucide-react";
import { API_BASE_URL, getCookieClient, Noticia, Categoria, Usuario } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    noticias: 0,
    categorias: 0,
    usuarios: 0,
  });
  const [recentNews, setRecentNews] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      setErrorMsg(null);
      const token = getCookieClient("token");

      if (!token) {
        setErrorMsg("Não foi possível autenticar o acesso aos dados.");
        setIsLoading(false);
        return;
      }

      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        };

        // Carregar notícias
        const resNoticias = await fetch(`${API_BASE_URL}/noticias`);
        if (!resNoticias.ok) throw new Error("Erro ao buscar notícias");
        const listNoticias: Noticia[] = await resNoticias.json();

        // Carregar categorias
        const resCategorias = await fetch(`${API_BASE_URL}/categorias`);
        if (!resCategorias.ok) throw new Error("Erro ao buscar categorias");
        const listCategorias: Categoria[] = await resCategorias.json();

        // Carregar usuários (requer autenticação)
        const resUsuarios = await fetch(`${API_BASE_URL}/usuarios`, { headers });
        if (!resUsuarios.ok) throw new Error("Erro ao buscar usuários");
        const listUsuarios: Usuario[] = await resUsuarios.json();

        setStats({
          noticias: listNoticias.length,
          categorias: listCategorias.length,
          usuarios: listUsuarios.length,
        });

        // Pegar as 4 notícias mais recentes
        setRecentNews(listNoticias.slice(0, 4));

      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        setErrorMsg("Falha na comunicação com o servidor backend. Verifique a API.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary mb-2" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          CARREGANDO ESTATÍSTICAS...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-reveal">
      {/* Header do Dashboard */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Painel Geral
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase mt-1">
            ESTADO DOS REGISTROS // LOGS OPERACIONAIS
          </p>
        </div>

        {/* Botão de Atalho Rápido */}
        <Link
          href="/admin/noticias?action=new"
          className="inline-flex items-center gap-1.5 border border-brand-accent bg-brand-accent text-black font-black uppercase px-4 py-2 text-xs font-mono tracking-wider transition-all hover:bg-black hover:text-brand-accent hover:border-brand-accent rounded-[2px]"
        >
          <Plus className="h-3.5 w-3.5" />
          NOVA NOTÍCIA
        </Link>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2.5 border border-red-950/45 bg-red-950/10 p-4 text-red-400 rounded-[2px] text-xs font-mono">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-brand-accent" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Notícias */}
        <div className="border border-zinc-800 bg-[#0c0c0e] p-6 relative overflow-hidden group hover:border-brand-accent transition-all rounded-[2px]">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-mono text-[10px] uppercase tracking-widest">NOTÍCIAS</span>
            <Newspaper className="h-4 w-4 text-zinc-600 group-hover:text-brand-accent transition-colors" />
          </div>
          <p className="mt-4 text-4xl font-black font-mono text-white tracking-tight">
            {stats.noticias.toString().padStart(2, "0")}
          </p>
          <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-[9px] font-mono text-zinc-650">
            <span>PUBLICADAS</span>
            <Link href="/admin/noticias" className="text-zinc-500 hover:text-white flex items-center gap-0.5">
              GERENCIAR <ArrowUpRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>

        {/* Categorias */}
        <div className="border border-zinc-800 bg-[#0c0c0e] p-6 relative overflow-hidden group hover:border-brand-primary transition-all rounded-[2px]">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-mono text-[10px] uppercase tracking-widest">CATEGORIAS</span>
            <Tags className="h-4 w-4 text-zinc-600 group-hover:text-brand-primary transition-colors" />
          </div>
          <p className="mt-4 text-4xl font-black font-mono text-white tracking-tight">
            {stats.categorias.toString().padStart(2, "0")}
          </p>
          <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-[9px] font-mono text-zinc-650">
            <span>ATIVAS NO SISTEMA</span>
            <Link href="/admin/categorias" className="text-zinc-500 hover:text-white flex items-center gap-0.5">
              GERENCIAR <ArrowUpRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>

        {/* Usuários */}
        <div className="border border-zinc-800 bg-[#0c0c0e] p-6 relative overflow-hidden group hover:border-zinc-500 transition-all rounded-[2px]">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-mono text-[10px] uppercase tracking-widest">USUÁRIOS</span>
            <Users className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
          </div>
          <p className="mt-4 text-4xl font-black font-mono text-white tracking-tight">
            {stats.usuarios.toString().padStart(2, "0")}
          </p>
          <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-[9px] font-mono text-zinc-650">
            <span>ADMINISTRADORES</span>
            <Link href="/admin/usuarios" className="text-zinc-500 hover:text-white flex items-center gap-0.5">
              GERENCIAR <ArrowUpRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de Atividade e Ações Rápidas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Atividade Recente (8/12 colunas) */}
        <div className="lg:col-span-8 border border-zinc-800 bg-[#0c0c0e] p-6 rounded-[2px]">
          <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-primary" />
            <span>[ ÚLTIMAS_PUBLICADAS ]</span>
          </h3>

          {recentNews.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 font-mono text-xs">
              Nenhuma notícia cadastrada recentemente.
            </div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {recentNews.map((news) => (
                <div key={news.noticiaID} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-200 truncate">{news.titulo}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-zinc-500">
                      <span className="text-brand-primary">{news.categoriaDescricao.toUpperCase()}</span>
                      <span>•</span>
                      <span>POR: {news.usuarioNome.toUpperCase()}</span>
                    </div>
                  </div>
                  <Link
                    href={`/noticia/${news.slug}`}
                    target="_blank"
                    className="shrink-0 p-1 border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-brand-primary hover:border-brand-primary rounded-[2px]"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu de Ações Rápidas (4/12 colunas) */}
        <div className="lg:col-span-4 border border-zinc-800 bg-zinc-950/40 p-6 rounded-[2px] flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 mb-4">
              [ AÇÕES_RÁPIDAS ]
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <Link
                href="/admin/noticias?action=new"
                className="flex items-center justify-between border border-zinc-800 bg-[#0c0c0e] p-3 text-zinc-400 hover:text-white hover:border-brand-accent transition-all rounded-[2px]"
              >
                <span>CRIAR NOVA NOTÍCIA</span>
                <Plus className="h-4 w-4 text-zinc-550" />
              </Link>
              <Link
                href="/admin/categorias"
                className="flex items-center justify-between border border-zinc-800 bg-[#0c0c0e] p-3 text-zinc-400 hover:text-white hover:border-brand-primary transition-all rounded-[2px]"
              >
                <span>GERENCIAR CATEGORIAS</span>
                <Plus className="h-4 w-4 text-zinc-550" />
              </Link>
              <Link
                href="/admin/usuarios"
                className="flex items-center justify-between border border-zinc-800 bg-[#0c0c0e] p-3 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all rounded-[2px]"
              >
                <span>ADICIONAR NOVO ADMIN</span>
                <Plus className="h-4 w-4 text-zinc-550" />
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-900 font-mono text-[9px] text-zinc-650 leading-relaxed uppercase">
            SISTEMA OPERACIONAL REGULADO // VER 2.6 // CONEXÃO DE PORTA LOCALHOST 5000
          </div>
        </div>
      </div>
    </div>
  );
}
