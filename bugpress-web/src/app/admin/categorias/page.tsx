"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Tag,
  ArrowLeft,
  X
} from "lucide-react";
import { API_BASE_URL, getCookieClient, Categoria } from "@/lib/api";

export default function CategoriasCrud() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estados de Form
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [descricao, setDescricao] = useState("");

  const loadCategorias = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/categorias`);
      if (!res.ok) throw new Error("Falha ao carregar as categorias.");
      const data = await res.json();
      setCategorias(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(true);
    setCurrentId(null);
    setDescricao("");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleOpenEdit = (cat: Categoria) => {
    setIsEditing(true);
    setCurrentId(cat.categoriaID);
    setDescricao(cat.descricao);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setDescricao("");
    setErrorMsg(null);
    setSuccessMsg(null);
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

    if (!descricao.trim()) {
      setErrorMsg("A descrição da categoria não pode ficar em branco.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      categoriaID: currentId || 0,
      descricao: descricao.trim(),
    };

    try {
      let url = `${API_BASE_URL}/categorias`;
      let method = "POST";

      if (currentId) {
        url = `${API_BASE_URL}/categorias/${currentId}`;
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
        throw new Error(data.message || "Não foi possível registrar a categoria.");
      }

      setSuccessMsg(currentId ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!");
      
      setTimeout(() => {
        handleCloseForm();
        loadCategorias();
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro ao salvar a categoria.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente remover esta categoria?")) {
      return;
    }

    const token = getCookieClient("token");
    if (!token) {
      setErrorMsg("Erro de autenticação para deleção de registros.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Falha ao remover a categoria.");
      }

      setSuccessMsg("Categoria removida com sucesso.");
      loadCategorias();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro desconhecido ao remover a categoria.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary mb-2" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          CARREGANDO CATEGORIAS...
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
            Categorias de Notícias
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase mt-1">
            ESTRUTURA DE NAVEGAÇÃO // CLASSIFICADORES
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 border border-brand-primary bg-brand-primary text-black font-black uppercase px-4 py-2 text-xs font-mono tracking-wider transition-all hover:bg-black hover:text-brand-primary hover:border-brand-primary rounded-[2px]"
          >
            <Plus className="h-3.5 w-3.5" />
            NOVA CATEGORIA
          </button>
        )}
      </div>

      {/* Feedbacks */}
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

      {/* Grid Central */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Lista de Categorias (Tabela) */}
        <div className={`border border-zinc-800 bg-[#0c0c0e] rounded-[2px] overflow-hidden ${isEditing ? "lg:col-span-7" : "lg:col-span-12"}`}>
          {categorias.length === 0 ? (
            <div className="p-12 text-center text-zinc-550 font-mono text-xs">
              Nenhuma categoria localizada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    <th className="py-4 px-6 font-medium">ID</th>
                    <th className="py-4 px-6 font-medium">Descrição</th>
                    <th className="py-4 px-6 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs">
                  {categorias.map((cat) => (
                    <tr key={cat.categoriaID} className="hover:bg-zinc-900/35 transition-colors">
                      <td className="py-4 px-6 font-mono text-zinc-550">#{cat.categoriaID}</td>
                      <td className="py-4 px-6 font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-brand-accent shrink-0" />
                        {cat.descricao}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white hover:border-zinc-550 rounded-[2px]"
                            title="Editar Categoria"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.categoriaID)}
                            className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-red-400 hover:border-red-950 rounded-[2px]"
                            title="Excluir Categoria"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Painel do Formulário Inline (Direita - 5/12 colunas) */}
        {isEditing && (
          <div className="lg:col-span-5 border border-zinc-800 bg-[#0c0c0e] p-6 rounded-[2px] relative overflow-hidden h-fit animate-reveal">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-primary" />
            
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <h2 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                {currentId ? `[ EDITAR_CATEGORIA_ID: #${currentId} ]` : "[ NOVA_CATEGORIA ]"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-1 text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Descrição */}
              <div>
                <label className="block font-mono text-xs font-bold text-zinc-400 uppercase mb-2">
                  Descrição da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Seguranca, Redes, Hardware"
                  className="block w-full border border-zinc-800 bg-zinc-950 py-2.5 px-3 font-mono text-sm text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px] uppercase"
                />
              </div>

              {/* Botões do Form */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 border border-brand-primary bg-brand-primary text-black font-black uppercase py-2.5 text-xs font-mono tracking-wider transition-all hover:bg-black hover:text-brand-primary hover:border-brand-primary disabled:opacity-50 rounded-[2px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      SALVANDO...
                    </>
                  ) : (
                    "SALVAR REGISTRO"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="inline-flex items-center justify-center border border-zinc-800 bg-transparent text-zinc-400 px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-zinc-900 hover:text-white rounded-[2px]"
                >
                  FECHAR
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
