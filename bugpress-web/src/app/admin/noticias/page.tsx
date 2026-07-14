"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Tag,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";
import { API_BASE_URL, getCookieClient, Noticia, Categoria } from "@/lib/api";

function NoticiasCrudContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Estados principais
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estados de Form/View
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  // Carregar dados iniciais
  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const resNoticias = await fetch(`${API_BASE_URL}/noticias`);
      if (!resNoticias.ok) throw new Error("Falha ao carregar notícias.");
      const dataNoticias = await resNoticias.json();
      setNoticias(dataNoticias);

      const resCategorias = await fetch(`${API_BASE_URL}/categorias`);
      if (!resCategorias.ok) throw new Error("Falha ao carregar categorias.");
      const dataCategorias = await resCategorias.json();
      setCategorias(dataCategorias);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Detectar parâmetro action=new da URL
  useEffect(() => {
    if (searchParams.get("action") === "new" && categorias.length > 0) {
      handleOpenCreate();
    }
  }, [searchParams, categorias]);

  const handleOpenCreate = () => {
    setIsEditing(true);
    setCurrentId(null);
    setTitulo("");
    setTexto("");
    // Pega a primeira categoria disponível se houver
    setCategoriaId(categorias.length > 0 ? categorias[0].categoriaID.toString() : "");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleOpenEdit = (noticia: Noticia) => {
    setIsEditing(true);
    setCurrentId(noticia.noticiaID);
    setTitulo(noticia.titulo);
    setTexto(noticia.texto);
    setCategoriaId(noticia.categoriaID.toString());
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitulo("");
    setTexto("");
    setCategoriaId("");
    setErrorMsg(null);
    setSuccessMsg(null);
    // Limpar parâmetros da query
    router.push("/admin/noticias");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const token = getCookieClient("token");
    if (!token) {
      setErrorMsg("Sua sessão expirou. Faça login novamente.");
      setIsSubmitting(false);
      return;
    }

    if (!titulo.trim() || !texto.trim() || !categoriaId) {
      setErrorMsg("Todos os campos do formulário são obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      titulo: titulo.trim(),
      texto: texto.trim(),
      categoriaID: parseInt(categoriaId, 10),
    };

    try {
      let url = `${API_BASE_URL}/noticias`;
      let method = "POST";

      if (currentId) {
        url = `${API_BASE_URL}/noticias/${currentId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao registrar a notícia.");
      }

      setSuccessMsg(currentId ? "Notícia atualizada com sucesso!" : "Nova notícia criada com sucesso!");
      
      // Limpa formulário e recarrega os dados
      setTimeout(() => {
        handleCloseForm();
        loadData();
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro no envio dos dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja mesmo excluir esta notícia? Esta ação é irreversível.")) {
      return;
    }

    const token = getCookieClient("token");
    if (!token) {
      setErrorMsg("Erro de autenticação para deletar registro.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/noticias/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao deletar notícia.");
      }

      setSuccessMsg("Registro deletado com sucesso.");
      loadData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao processar remoção.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary mb-2" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          CARREGANDO BULLETINS...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-reveal">
      {/* Cabeçalho */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Gerenciamento de Notícias
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase mt-1">
            CMS INTERNO // {isEditing ? "FORMULÁRIO DE ARTIGO" : "LISTAGEM DE ARTIGOS"}
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 border border-brand-accent bg-brand-accent text-black font-black uppercase px-4 py-2 text-xs font-mono tracking-wider transition-all hover:bg-black hover:text-brand-accent hover:border-brand-accent rounded-[2px]"
          >
            <Plus className="h-3.5 w-3.5" />
            CRIAR ARTIGO
          </button>
        )}
      </div>

      {/* Feedbacks globais */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 border border-red-950/45 bg-red-950/10 p-4 text-red-400 rounded-[2px] text-xs font-mono">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-brand-accent" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start gap-2.5 border border-emerald-950/45 bg-emerald-950/10 p-4 text-emerald-400 rounded-[2px] text-xs font-mono">
          <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-brand-primary" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Modo de Edição / Criação */}
      {isEditing ? (
        <div className="border border-zinc-800 bg-[#0c0c0e] p-6 rounded-[2px] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-accent" />
          
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
            <h2 className="font-mono text-xs font-black uppercase tracking-wider text-white">
              {currentId ? `[ EDITAR_ARTIGO_ID: #${currentId} ]` : "[ NOVO_REGISTRO_DE_ARTIGO ]"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-zinc-550 hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" /> CANCELAR
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categoria */}
            <div>
              <label className="block font-mono text-xs font-bold text-zinc-400 uppercase mb-2">
                Categoria do Artigo
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
                className="block w-full border border-zinc-800 bg-zinc-950 py-2.5 px-3 font-mono text-sm text-zinc-300 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat) => (
                  <option key={cat.categoriaID} value={cat.categoriaID}>
                    {cat.descricao.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div>
              <label className="block font-mono text-xs font-bold text-zinc-400 uppercase mb-2">
                Título da Notícia
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                maxLength={200}
                placeholder="Insira o título informativo..."
                className="block w-full border border-zinc-800 bg-zinc-950 py-2.5 px-3 font-mono text-sm text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
              />
            </div>

            {/* Texto */}
            <div>
              <label className="block font-mono text-xs font-bold text-zinc-400 uppercase mb-2">
                Corpo do Artigo / Texto
              </label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                required
                rows={10}
                placeholder="Escreva a notícia em detalhes, separe parágrafos usando quebras de linha..."
                className="block w-full border border-zinc-800 bg-zinc-950 py-2.5 px-3 font-sans text-sm text-zinc-300 placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px] leading-relaxed"
              />
            </div>

            {/* Ações do Form */}
            <div className="flex items-center gap-4 pt-4 border-t border-zinc-900">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 border border-brand-primary bg-brand-primary text-black font-black uppercase px-5 py-2.5 text-xs font-mono tracking-wider transition-all hover:bg-black hover:text-brand-primary hover:border-brand-primary disabled:opacity-50 rounded-[2px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    REGISTRANDO...
                  </>
                ) : (
                  "SALVAR ARTIGO"
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseForm}
                className="inline-flex items-center gap-1.5 border border-zinc-800 bg-transparent text-zinc-400 px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-zinc-900 hover:text-white rounded-[2px]"
              >
                VOLTAR
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Listagem de Notícias */
        <div className="border border-zinc-800 bg-[#0c0c0e] rounded-[2px] overflow-hidden">
          {noticias.length === 0 ? (
            <div className="p-12 text-center text-zinc-550 font-mono text-xs">
              Nenhuma notícia localizada. Clique em "Criar Artigo" para lançar o primeiro.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    <th className="py-4 px-6 font-medium">ID</th>
                    <th className="py-4 px-6 font-medium">Título</th>
                    <th className="py-4 px-6 font-medium">Categoria</th>
                    <th className="py-4 px-6 font-medium">Autor</th>
                    <th className="py-4 px-6 font-medium">Data</th>
                    <th className="py-4 px-6 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs">
                  {noticias.map((news) => {
                    const dateFormatted = new Date(news.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });

                    return (
                      <tr key={news.noticiaID} className="hover:bg-zinc-900/35 transition-colors">
                        <td className="py-4 px-6 font-mono text-zinc-550">#{news.noticiaID}</td>
                        <td className="py-4 px-6 font-semibold text-zinc-200 max-w-xs sm:max-w-sm truncate">
                          {news.titulo}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-brand-primary uppercase">
                            <Tag className="h-2.5 w-2.5" />
                            {news.categoriaDescricao}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-zinc-400">
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3 w-3 text-zinc-650" />
                            {news.usuarioNome}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-zinc-500">{dateFormatted}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <Link
                              href={`/noticia/${news.slug}`}
                              target="_blank"
                              className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-brand-primary hover:border-brand-primary rounded-[2px]"
                              title="Visualizar Artigo"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              onClick={() => handleOpenEdit(news)}
                              className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white hover:border-zinc-500 rounded-[2px]"
                              title="Editar Artigo"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(news.noticiaID)}
                              className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-red-400 hover:border-red-950 rounded-[2px]"
                              title="Deletar Artigo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NoticiasCrud() {
  return (
    <Suspense fallback={
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary mb-2" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          MONTANDO AMBIENTE DE TRABALHO...
        </span>
      </div>
    }>
      <NoticiasCrudContent />
    </Suspense>
  );
}
