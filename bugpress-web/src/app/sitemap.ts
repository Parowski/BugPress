import { MetadataRoute } from "next";
import { getNoticias } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Rotas estáticas de alta prioridade
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    // Chamada à API para obter todas as notícias
    const noticias = await getNoticias();

    if (!Array.isArray(noticias)) {
      return staticRoutes;
    }

    // Mapeamento dinâmico das rotas de notícias
    const dynamicRoutes = noticias.map((noticia) => {
      let lastMod: Date;
      try {
        lastMod = noticia.data ? new Date(noticia.data) : new Date();
        if (isNaN(lastMod.getTime())) {
          lastMod = new Date();
        }
      } catch {
        lastMod = new Date();
      }

      return {
        url: `${siteUrl}/noticia/${noticia.slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Erro ao gerar sitemap dinâmico no build:", error);
    // Retorno resiliente em caso de falha da API
    return staticRoutes;
  }
}
