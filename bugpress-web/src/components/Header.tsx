"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Newspaper, LayoutDashboard, LogOut, LogIn, Globe } from "lucide-react";
import { getCookieClient, deleteCookieClient } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Check login state on client mount and when pathname changes
  useEffect(() => {
    const token = getCookieClient("token");
    const userJson = localStorage.getItem("user");
    if (token && userJson) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userJson);
        setUserName(user.nome || user.login);
      } catch {
        setUserName("Admin");
      }
    } else {
      setIsLoggedIn(false);
      setUserName(null);
    }
  }, [pathname]);

  // Hide header on admin and login screens
  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    deleteCookieClient("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Notícias", href: "/" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#09090b]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2 text-xl font-bold tracking-tighter text-white">
            <span className="flex items-center justify-center bg-brand-accent px-1.5 py-0.5 text-xs font-mono font-black text-black uppercase">
              Bug
            </span>
            <span>
              Press<span className="text-brand-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white ${
                    isActive ? "text-brand-primary" : "text-zinc-400"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="text-xs font-mono text-zinc-400">
                LOGADO COMO: <span className="text-brand-primary">{userName?.toUpperCase()}</span>
              </span>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-mono font-medium text-white transition-all hover:bg-zinc-800 hover:border-brand-primary rounded-[2px]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                PAINEL
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 border border-transparent bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-red-400 px-3 py-1.5 text-xs font-mono font-medium transition-all rounded-[2px]"
              >
                <LogOut className="h-3.5 w-3.5" />
                SAIR
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 border border-brand-accent bg-brand-accent text-black font-black uppercase px-4 py-2 text-xs font-mono tracking-wider transition-all hover:bg-black hover:text-brand-accent hover:border-brand-accent rounded-[2px]"
            >
              <LogIn className="h-3.5 w-3.5" />
              ENTRAR
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#09090b] px-4 py-4 space-y-4 animate-reveal">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium ${
                  pathname === link.href ? "text-brand-primary" : "text-zinc-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <hr className="border-zinc-800" />

          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <div className="text-xs font-mono text-zinc-400 px-1 py-1">
                  LOGADO: <span className="text-brand-primary">{userName?.toUpperCase()}</span>
                </div>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-mono text-white rounded-[2px]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  PAINEL ADMINISTRATIVO
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 border border-red-950/50 bg-red-950/20 text-red-400 px-4 py-2.5 text-sm font-mono rounded-[2px]"
                >
                  <LogOut className="h-4 w-4" />
                  SAIR DO SISTEMA
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 border border-brand-accent bg-brand-accent text-black font-black uppercase py-3 text-xs font-mono tracking-wider rounded-[2px]"
              >
                <LogIn className="h-4 w-4" />
                ENTRAR
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
