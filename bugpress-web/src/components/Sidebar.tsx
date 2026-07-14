"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Users,
  Home,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
  X
} from "lucide-react";
import { deleteCookieClient } from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Administrador");
  const [userLogin, setUserLogin] = useState("admin");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserName(user.nome || "Administrador");
        setUserLogin(user.login || "admin");
      } catch {
        // Fallback padrão
      }
    }
  }, []);

  const handleLogout = () => {
    deleteCookieClient("token");
    localStorage.removeItem("user");
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Notícias", href: "/admin/noticias", icon: Newspaper },
    { name: "Categorias", href: "/admin/categorias", icon: Tags },
    { name: "Usuários", href: "/admin/usuarios", icon: Users },
  ];

  return (
    <>
      {/* Botão de Menu Móvel (Superior) */}
      <div className="flex md:hidden items-center justify-between bg-[#0e0e11] px-4 h-16 border-b border-zinc-800 w-full shrink-0">
        <Link href="/admin" className="flex items-center gap-2 text-md font-bold tracking-tighter text-white">
          <span className="bg-brand-accent px-1.5 py-0.2 text-xs font-mono font-black text-black">
            BUG
          </span>
          <span>ADMIN</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Móvel) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-[#0c0c0e] transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Info */}
        <div className="flex h-16 items-center gap-2 border-b border-zinc-850 px-6 shrink-0">
          <Shield className="h-5 w-5 text-brand-primary" />
          <span className="font-mono text-xs font-black uppercase tracking-widest text-zinc-200">
            PAINEL DE SESSÃO
          </span>
        </div>

        {/* User profile */}
        <div className="border-b border-zinc-850 p-6 shrink-0">
          <p className="text-sm font-bold text-white tracking-tight truncate">{userName}</p>
          <p className="font-mono text-[10px] text-brand-accent uppercase tracking-wider mt-0.5">
            LOG: {userLogin}
          </p>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all rounded-[2px] ${
                  isActive
                    ? "bg-zinc-900 text-brand-primary border-l-2 border-brand-primary pl-2.5"
                    : "text-zinc-400 hover:bg-zinc-950 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-brand-primary" : "text-zinc-500"}`} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-zinc-850 p-4 shrink-0 space-y-2">
          <Link
            href="/"
            className="flex w-full items-center gap-3 px-3 py-2 text-xs font-mono uppercase text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>VISUALIZAR PORTAL</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-xs font-mono uppercase text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all rounded-[2px]"
          >
            <LogOut className="h-4 w-4" />
            <span>SAIR DO PAINEL</span>
          </button>
        </div>
      </aside>
    </>
  );
}
