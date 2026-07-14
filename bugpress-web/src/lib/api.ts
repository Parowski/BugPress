export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper to get cookies on the client side
export function getCookieClient(name: string): string | null {
  if (typeof window === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper to set cookies on the client side
export function setCookieClient(name: string, value: string, days = 7) {
  if (typeof window === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

// Helper to remove cookies on the client side
export function deleteCookieClient(name: string) {
  if (typeof window === "undefined") return;
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export interface Categoria {
  categoriaID: number;
  descricao: string;
}

export interface Noticia {
  noticiaID: number;
  titulo: string;
  texto: string;
  data: string;
  slug: string;
  categoriaID: number;
  categoriaDescricao: string;
  usuarioID: number;
  usuarioNome: string;
}

export interface Usuario {
  usuarioID: number;
  nome: string;
  email: string;
  telefone?: string;
  sexo?: string;
  login: string;
}

// Get standard headers
function getHeaders(token?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Fetch all news
export async function getNoticias(): Promise<Noticia[]> {
  const res = await fetch(`${API_BASE_URL}/noticias`, {
    next: { revalidate: 5 }, // Revalidate every 5 seconds (ISR)
  });
  if (!res.ok) return [];
  return res.json();
}

// Fetch single news by slug
export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const res = await fetch(`${API_BASE_URL}/noticias/${slug}`, {
    next: { revalidate: 5 },
  });
  if (!res.ok) return null;
  return res.json();
}

// Fetch all categories
export async function getCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${API_BASE_URL}/categorias`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) return [];
  return res.json();
}
