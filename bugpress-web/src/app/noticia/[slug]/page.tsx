import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoticiaBySlug, API_BASE_URL } from "@/lib/api";
import { Calendar, User, Tag, ArrowLeft, Clock } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Geração dinâmica de metadados de SEO para cada notícia
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  try {
    const noticia = await getNoticiaBySlug(slug);
    if (!noticia) {
      return {
        title: "Notícia Não Encontrada - BugPress",
        description: "A notícia solicitada não foi localizada em nossa base de dados.",
      };
    }

    const cleanDescription = noticia.texto
      ? noticia.texto.replace(/\s+/g, " ").trim().substring(0, 150) + "..."
      : "Notícia publicada no portal BugPress.";
    
    const autorNome = noticia.usuarioNome || "Redação BugPress";

    return {
      title: `${noticia.titulo} | BugPress`,
      description: cleanDescription,
      authors: [{ name: autorNome }],
      alternates: {
        canonical: `/noticia/${slug}`,
      },
      openGraph: {
        title: noticia.titulo,
        description: cleanDescription,
        type: "article",
        url: `${siteUrl}/noticia/${slug}`,
        publishedTime: noticia.data,
        modifiedTime: noticia.data,
        authors: [autorNome],
        images: [
          {
            url: `${siteUrl}/api/og?title=${encodeURIComponent(noticia.titulo)}`,
            width: 1200,
            height: 630,
            alt: noticia.titulo,
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: noticia.titulo,
        description: cleanDescription,
        images: [`${siteUrl}/api/og?title=${encodeURIComponent(noticia.titulo)}`],
      }
    };
  } catch (error) {
    return {
      title: "Erro ao carregar notícia - BugPress",
    };
  }
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);

  if (!noticia) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const dateFormatted = new Date(noticia.data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Tempo de leitura estimado
  const wordCount = noticia.texto.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const cleanDescription = noticia.texto
    ? noticia.texto.replace(/\s+/g, " ").trim().substring(0, 150) + "..."
    : "Notícia publicada no portal BugPress.";
  
  const autorNome = noticia.usuarioNome || "Redação BugPress";

  // JSON-LD estruturado do tipo NewsArticle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/noticia/${slug}`
    },
    "headline": noticia.titulo,
    "description": cleanDescription,
    "image": [
      `${siteUrl}/api/og?title=${encodeURIComponent(noticia.titulo)}`
    ],
    "datePublished": noticia.data,
    "dateModified": noticia.data,
    "author": {
      "@type": "Person",
      "name": autorNome,
      "jobTitle": "Jornalista Técnico",
      "worksFor": {
        "@type": "Organization",
        "name": "BugPress"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "BugPress",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/next.svg`
      }
    }
  };

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-reveal">
      {/* Script SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Botão de Voltar */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-brand-primary uppercase transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          [ VOLTAR_PARA_PAINEL ]
        </Link>
      </div>

      {/* Cabeçalho do Artigo */}
      <header className="border-b border-zinc-800 pb-8 mb-10">
        {/* Categoria */}
        <div className="mb-4 inline-flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-xs text-brand-primary">
          <Tag className="h-3 w-3" />
          <span>{noticia.categoriaDescricao.toUpperCase()}</span>
        </div>

        {/* Título do Artigo */}
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
          {noticia.titulo}
        </h1>

        {/* Metadados */}
        <div className="mt-6 flex flex-wrap gap-y-3 gap-x-6 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <User className="h-4 w-4 text-brand-accent" />
            <span>AUTOR: {noticia.usuarioNome.toUpperCase()}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-zinc-600" />
            <span>PUBLICADO EM: {dateFormatted}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-zinc-600" />
            <span>LEITURA: {readTime} MIN</span>
          </span>
        </div>
      </header>

      {/* Texto do Artigo */}
      <div className="prose prose-invert max-w-none">
        {noticia.texto.split("\n\n").map((paragrafo, idx) => (
          <p
            key={idx}
            className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-6 font-light whitespace-pre-line"
          >
            {paragrafo}
          </p>
        ))}
      </div>

      {/* Rodapé Interno do Artigo */}
      <div className="mt-12 border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-600">
        <span>ID DA NOTÍCIA: #{noticia.noticiaID}</span>
        <span>BUGPRESS INVESTIGAÇÃO CIBERNÉTICA</span>
      </div>
    </article>
  );
}
