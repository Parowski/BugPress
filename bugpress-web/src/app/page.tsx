import Link from "next/link";
import { getNoticias, Noticia } from "@/lib/api";
import { Calendar, User, Tag, ArrowUpRight, AlertTriangle } from "lucide-react";

export const revalidate = 5; // ISR: Revalidar a página a cada 5 segundos

export default async function Home() {
  let noticias: Noticia[] = [];
  let isOffline = false;

  try {
    noticias = await getNoticias();
  } catch (error) {
    console.error("Erro ao buscar notícias no servidor:", error);
    isOffline = true;
  }

  // Schema.org JSON-LD para SEO estruturado
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "BugPress",
    "url": "http://localhost:3000",
    "logo": "http://localhost:3000/next.svg",
    "description": "Portal independente especializado em notícias técnicas de vulnerabilidades e bugs.",
    "publishingPrinciples": "https://bugpress.com.br/principios",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "addressCountry": "BR"
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Script de SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section Assimétrico Brutalista */}
      <section className="relative mb-20 border-b border-zinc-800 pb-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-xs text-brand-primary">
              <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
              RELATÓRIOS EM TEMPO REAL
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-none">
              DEPURAÇÃO <br />
              <span className="text-zinc-500">&amp;</span> ANÁLISE <br />
              <span className="text-stroke-premium font-mono">CRÍTICA.</span>
            </h1>
          </div>
          <div className="max-w-md border-l-2 border-brand-accent pl-6 text-zinc-400">
            <p className="text-sm sm:text-base leading-relaxed">
              Investigando incidentes técnicos de 2026. Das falhas de compilação em produção aos incidentes de escalação global de rede. Onde o bug é a notícia.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Lista de notícias (Esquerda - 8/12 colunas) */}
        <main className="lg:col-span-8 space-y-12">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <span>[ BULLETIN_BOARD ]</span>
            <span className="h-px flex-1 bg-zinc-800"></span>
          </h2>

          {isOffline ? (
            <div className="border border-red-950/40 bg-red-950/10 p-6 text-center rounded-[2px] animate-reveal">
              <AlertTriangle className="mx-auto h-8 w-8 text-brand-accent mb-3" />
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">Falha de Conexão com a API</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Não foi possível estabelecer contato com a base de dados em <code className="text-red-300">localhost:5000</code>. Verifique se o servidor backend está ativo.
              </p>
            </div>
          ) : noticias.length === 0 ? (
            <div className="border border-zinc-800 bg-zinc-950/40 py-16 text-center rounded-[2px] animate-reveal">
              <p className="text-sm font-mono text-zinc-500">Nenhum registro de notícia cadastrado no sistema.</p>
              <Link
                href="/admin/noticias"
                className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-brand-primary hover:text-white uppercase transition-colors"
              >
                PUBLICAR PRIMEIRA NOTÍCIA <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {noticias.map((noticia, index) => {
                const dateFormatted = new Date(noticia.data).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <article
                    key={noticia.noticiaID}
                    className="group relative flex flex-col justify-between border border-zinc-800 bg-[#0c0c0e] p-6 transition-all duration-300 hover:border-brand-accent rounded-[2px] animate-reveal"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div>
                      {/* Categoria */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-brand-primary">
                          <Tag className="h-3 w-3" />
                          {noticia.categoriaDescricao}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600">{`#${noticia.noticiaID}`}</span>
                      </div>

                      {/* Título */}
                      <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-brand-accent mb-3">
                        <Link href={`/noticia/${noticia.slug}`} className="focus:outline-none">
                          <span className="absolute inset-0 z-10" />
                          {noticia.titulo}
                        </Link>
                      </h3>

                      {/* Preview do texto */}
                      <p className="text-xs text-zinc-400 line-clamp-3 mb-6 leading-relaxed">
                        {noticia.texto}
                      </p>
                    </div>

                    {/* Metadados */}
                    <div className="mt-auto pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-zinc-600" />
                        {noticia.usuarioNome}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                        {dateFormatted}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {/* Sidebar Lateral de Suporte (Direita - 4/12 colunas) */}
        <aside className="lg:col-span-4 space-y-10">
          {/* Caixa Técnica / Manifesto */}
          <div className="border border-zinc-800 bg-[#0c0c0e] p-6 rounded-[2px]">
            <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 mb-4">
              [ MANIFESTO_2026 ]
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed space-y-3">
              Não fazemos relatórios de marketing. Cobrimos as dores de produção, a verdade dos logs e a realidade técnica das falhas. Nosso compromisso é com a clareza e com a engenharia.
            </p>
            <div className="mt-6 flex items-center justify-between font-mono text-[10px] text-zinc-500">
              <span>STATUS: OPERACIONAL</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          {/* Categorias Populares */}
          <div className="border border-zinc-800 bg-zinc-950/40 p-6 rounded-[2px]">
            <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 mb-4">
              [ CATEGORIAS_ATIVAS ]
            </h3>
            <div className="flex flex-wrap gap-2">
              {!isOffline && noticias.length > 0 ? (
                Array.from(new Set(noticias.map((n) => n.categoriaDescricao))).map((cat) => (
                  <span
                    key={cat}
                    className="border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-400 uppercase"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="font-mono text-[10px] text-zinc-600">Nenhuma categoria registrada.</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
