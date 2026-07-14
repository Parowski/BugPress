# Plano de Migração: BugPress 2026

Este documento registra o planejamento da migração do BugPress (ASP.NET Web Forms) para uma arquitetura moderna (Next.js + ASP.NET Core Web API + PostgreSQL) otimizada para SEO e GEO em 2026.

## Arquitetura Proposta
- **Backend**: ASP.NET Core 8+ Web API (C#) com Entity Framework Core e autenticação JWT.
- **Frontend**: Next.js 14+ (React) com Tailwind CSS v4, Framer Motion e TypeScript.
- **Banco de Dados**: PostgreSQL com migrations controladas.

## Estrutura do Projeto
- `BugPress.API/`: Diretório do backend em ASP.NET Core.
- `BugPress.Web/`: Diretório do frontend em Next.js.

## Fases da Migração
1. **Fase 1: Preparação do Banco e Modelagem**
   - Configuração do PostgreSQL.
   - Modelagem de dados com EF Core (`AppDbContext`).
2. **Fase 2: Desenvolvimento da API Backend**
   - Criação de endpoints REST para Notícias, Categorias e Usuários.
   - Implementação de autenticação JWT e criptografia de senhas com BCrypt.
3. **Fase 3: Desenvolvimento do Frontend Next.js**
   - Interface pública moderna com Next.js App Router e Tailwind CSS v4.
   - Integração com a API Backend e controle de sessão admin.
4. **Fase 4: SEO e Otimização para GEO**
   - Injeção de metadados dinâmicos e estruturação JSON-LD Schema.org (`NewsArticle`).
   - Geração de sitemaps, robots.txt e suporte a URLs amigáveis baseadas em slugs.
5. **Fase 5: Testes e Validação**
   - Execução de linter e varredura de segurança.

## Agentes Envolvidos na Orquestração
- `@database-architect` (Estruturação e migração de banco)
- `@backend-specialist` (Desenvolvimento da API e segurança)
- `@frontend-specialist` (Desenvolvimento da interface e interações)
- `@seo-specialist` (Configuração de metadados, Schema.org e slugs)
- `@test-engineer` (Validação de qualidade e segurança)
