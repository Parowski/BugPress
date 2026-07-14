"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, AlertTriangle, CheckCircle, ArrowLeft, Loader2, Lock, User } from "lucide-react";
import { API_BASE_URL, setCookieClient, getCookieClient } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Redireciona se já estiver logado
  useEffect(() => {
    const token = getCookieClient("token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!login.trim() || !senha.trim()) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Credenciais inválidas. Tente novamente.");
      }

      // Sucesso no Login
      setSuccessMsg("Autenticação realizada com sucesso. Acessando painel...");
      
      // Salva token no cookie (válido por 7 dias, Lax, path=/)
      setCookieClient("token", data.token, 7);
      
      // Salva dados do usuário no localStorage
      localStorage.setItem("user", JSON.stringify(data.usuario));

      // Redireciona após 1.5s para exibir o feedback de sucesso
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1200);

    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro ao tentar realizar o login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#09090b]">
      {/* Botão Voltar */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-brand-primary uppercase transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          [ VOLTAR ]
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Identidade */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-black tracking-tighter text-white">
            <span className="bg-brand-accent px-2 py-0.5 text-sm font-mono font-black text-black uppercase rounded-[2px]">
              BUG
            </span>
            <span>PRESS</span>
          </Link>
          <h2 className="mt-6 text-sm font-mono text-zinc-400 uppercase tracking-widest">
            Acesso Restrito Administrativo
          </h2>
        </div>

        {/* Card Formulário Glassmorphism / Brutalist */}
        <div className="border border-zinc-800 bg-[#0e0e11]/60 backdrop-blur-xl p-8 rounded-[4px] shadow-2xl relative overflow-hidden">
          {/* Linha decorativa brutalista */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-brand-accent" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo Login */}
            <div>
              <label htmlFor="login" className="block font-mono text-xs font-bold text-zinc-400 uppercase mb-2">
                Identificador / Usuário
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="login"
                  type="text"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Seu login"
                  className="block w-full border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-3 font-mono text-sm text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block font-mono text-xs font-bold text-zinc-400 uppercase mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-3 font-mono text-sm text-white placeholder-zinc-700 transition-colors focus:border-brand-primary focus:outline-none rounded-[2px]"
                />
              </div>
            </div>

            {/* Feedbacks de Alerta */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 border border-red-950/40 bg-red-950/10 p-3 text-red-400 rounded-[2px] text-xs font-mono animate-reveal">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-brand-accent" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2.5 border border-emerald-950/40 bg-emerald-950/10 p-3 text-emerald-400 rounded-[2px] text-xs font-mono animate-reveal">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-brand-primary" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Botão Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center items-center gap-2 border border-brand-accent bg-brand-accent text-black font-black uppercase py-3 text-xs font-mono tracking-wider transition-all hover:bg-black hover:text-brand-accent hover:border-brand-accent disabled:opacity-50 disabled:cursor-not-allowed rounded-[2px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  VALIDANDO...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  ENTRAR NO SISTEMA
                </>
              )}
            </button>
          </form>
        </div>

        {/* Nota técnica */}
        <p className="text-center font-mono text-[10px] text-zinc-700">
          SECURE ENVELOPE NODE // PORT: 5000 // VER: 2026.1
        </p>
      </div>
    </div>
  );
}
