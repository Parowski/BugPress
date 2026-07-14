"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  AlertTriangle,
  CheckCircle,
  User,
  Mail,
  Phone,
  UserCheck,
  X,
  Lock
} from "lucide-react";
import { API_BASE_URL, getCookieClient, Usuario } from "@/lib/api";

export default function UsuariosCrud() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estados de Form
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [sexo, setSexo] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const loadUsuarios = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const token = getCookieClient("token");

    if (!token) {
      setErrorMsg("Você precisa estar autenticado para visualizar os usuários.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/usuarios`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Falha ao recuperar a lista de administradores.");
      }

      const data = await res.json();
      setUsuarios(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(true);
    setCurrentId(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setSexo("");
    setLogin("");
    setSenha("");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleOpenEdit = (user: Usuario) => {
    setIsEditing(true);
    setCurrentId(user.usuarioID);
    setNome(user.nome);
    setEmail(user.email);
    setTelefone(user.telefone || "");
    setSexo(user.sexo || "");
    setLogin(user.login);
    setSenha(""); // Mantém em branco por padrão
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setSexo("");
    setLogin("");
    setSenha("");
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

    // Validações básicas no cliente
    if (!nome.trim() || !email.trim() || !login.trim()) {
      setErrorMsg("Os campos Nome, E-mail e Login são obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    // Senha é obrigatória no cadastro de novos usuários
    if (!currentId && !senha.trim()) {
      setErrorMsg("A senha é obrigatória para o cadastro de novos usuários.");
      setIsSubmitting(false);
      return;
    }

    const payload: any = {
      usuarioID: currentId || 0,
      nome: nome.trim(),
      email: email.trim(),
      login: login.trim(),
      telefone: telefone.trim() || null,
      sexo: sexo || null,
    };

    // Apenas envia a senha se ela foi fornecida (ou se for novo cadastro)
    if (senha.trim()) {
      payload.senha = senha;
    }

    try {
      let url = `${API_BASE_URL}/usuarios`;
      let method = "POST";

      if (currentId) {
        url = `${API_BASE_URL}/usuarios/${currentId}`;
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
        throw new Error(data.message || "Erro ao registrar usuário.");
      }

      setSuccessMsg(currentId ? "Administrador atualizado com sucesso!" : "Novo administrador criado com sucesso!");

      setTimeout(() => {
        handleCloseForm();
        loadUsuarios();
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro no envio dos dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Evitar que o usuário se autodelete caso esteja no localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.usuarioID === id) {
          setErrorMsg("Operação negada: Não é possível deletar a si mesmo enquanto estiver logado.");
          return;
        }
      } catch {
        // Ignora e prossegue
      }
    }

    if (!confirm("Deseja realmente remover este administrador?")) {
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
      const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao tentar deletar o usuário.");
      }

      setSuccessMsg("Administrador removido com sucesso.");
      loadUsuarios();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro ao deletar usuário.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary mb-2" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          CARREGANDO ADMINISTRADORES...
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
            Usuários Administrativos
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase mt-1">
            CREDENCIAMENTO // CONTROLE DE ACESSO AO PORTAL
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 border border-brand-primary bg-brand-primary text-black font-black uppercase px-4 py-2 text-xs font-mono tracking-wider transition-all hover:bg-black hover:text-brand-primary hover:border-brand-primary rounded-[2px]"
          >
            <Plus className="h-3.5 w-3.5" />
            NOVO ADMIN
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
        {/* Tabela de Usuários */}
        <div className={`border border-zinc-800 bg-[#0c0c0e] rounded-[2px] overflow-hidden ${isEditing ? "lg:col-span-7" : "lg:col-span-12"}`}>
          {usuarios.length === 0 ? (
            <div className="p-12 text-center text-zinc-550 font-mono text-xs">
              Nenhum administrador registrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    <th className="py-4 px-6 font-medium">Nome</th>
                    <th className="py-4 px-6 font-medium">Login</th>
                    <th className="py-4 px-6 font-medium">E-mail</th>
                    <th className="py-4 px-6 font-medium">Informações</th>
                    <th className="py-4 px-6 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs">
                  {usuarios.map((user) => (
                    <tr key={user.usuarioID} className="hover:bg-zinc-900/35 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-zinc-200">{user.nome}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">ID: #{user.usuarioID}</div>
                      </td>
                      <td className="py-4 px-6 font-mono text-brand-primary">@{user.login}</td>
                      <td className="py-4 px-6 text-zinc-450 font-mono flex items-center gap-1.5 mt-2">
                        <Mail className="h-3 w-3 text-zinc-650" />
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-zinc-500 font-mono text-[10px]">
                        {user.sexo && <div>SEXO: {user.sexo.toUpperCase()}</div>}
                        {user.telefone && <div>TEL: {user.telefone}</div>}
                        {!user.sexo && !user.telefone && <span>-</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white hover:border-zinc-550 rounded-[2px]"
                            title="Editar Dados"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.usuarioID)}
                            className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-red-400 hover:border-red-950 rounded-[2px]"
                            title="Excluir Usuário"
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

        {/* Formulário de Edição / Criação */}
        {isEditing && (
          <div className="lg:col-span-5 border border-zinc-800 bg-[#0c0c0e] p-6 rounded-[2px] relative overflow-hidden h-fit animate-reveal">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-primary" />

            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <h2 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                {currentId ? `[ EDITAR_ADMIN_ID: #${currentId} ]` : "[ NOVO_ADMINISTRADOR ]"}
              </h2>
              <button onClick={handleCloseForm} className="p-1 text-zinc-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              {/* Nome */}
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">Nome Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-600">
                    <User className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do administrador"
                    className="block w-full border border-zinc-800 bg-zinc-950 py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">E-mail Corporativo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-600">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@empresa.com"
                    className="block w-full border border-zinc-800 bg-zinc-950 py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
                  />
                </div>
              </div>

              {/* Login */}
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">Nome de Usuário / Login</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-600">
                    <UserCheck className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="identificador_acesso"
                    className="block w-full border border-zinc-800 bg-zinc-950 py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-zinc-400 uppercase">Senha</label>
                  {currentId && (
                    <span className="text-[9px] text-zinc-600 uppercase">DEIXE EM BRANCO PARA MANTER</span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-600">
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="password"
                    required={!currentId}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder={currentId ? "•••••••• (opcional)" : "••••••••"}
                    className="block w-full border border-zinc-800 bg-zinc-950 py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">Telefone</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-600">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="block w-full border border-zinc-800 bg-zinc-950 py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
                  />
                </div>
              </div>

              {/* Sexo */}
              <div>
                <label className="block font-bold text-zinc-400 uppercase mb-1.5">Gênero / Sexo</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="block w-full border border-zinc-800 bg-zinc-950 py-2 px-3 text-xs text-zinc-300 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
                >
                  <option value="">Selecione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
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
                    "SALVAR ADMIN"
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
