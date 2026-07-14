# BugPress 2026 🚀

O **BugPress** é um portal de notícias moderno e de alta performance, atualizado para as tendências de mercado de 2026. A antiga aplicação baseada em ASP.NET Web Forms e SQL Server foi completamente migrada para uma arquitetura desacoplada e escalável que atende aos rigorosos padrões de SEO e GEO (Generative Engine Optimization).

---

## 🏗️ Arquitetura do Sistema

O projeto é dividido de forma modular e independente:

```
c:\Projetos\bugpress
├── BugPress/            # Projeto Legado (ASP.NET Web Forms - preservado para histórico)
├── BugPress.API/        # Nova API Backend (ASP.NET Core 8+)
└── bugpress-web/        # Novo Frontend Web (Next.js 14+ / Tailwind CSS v4)
```

### 1. Backend (API) — `BugPress.API/`
Desenvolvido em **ASP.NET Core 8+ Web API** utilizando as melhores práticas modernas:
- **Segurança**: Autenticação baseada em tokens **JWT (JSON Web Token)** e criptografia de senhas com **BCrypt.Net**.
- **Persistência**: Integração com banco de dados **PostgreSQL** por meio do **Entity Framework Core (EF Core)**.
- **Slugs**: Geração automática e dinâmica de slugs amigáveis para notícias a partir do título, gerenciando automaticamente eventuais colisões de nomes (ex: `titulo-da-noticia-1`).

### 2. Frontend — `bugpress-web/`
Interface desenvolvida com **Next.js (App Router)** e estilizada sob a estética **Technical Brutalism / Dark Raw**:
- **Design Premium**: Visual refinado utilizando Tailwind CSS v4, tipografia Outfit/Inter e carregamento dinâmico.
- **Área Administrativa**: Dashboard brutalista completo para gerenciamento (CRUD) de notícias, categorias e administradores.
- **SSR/SSG**: Renderização rápida no lado do servidor para garantir que robôs de busca e assistentes de inteligência artificial capturem o conteúdo de forma instantânea.

---

## 🌐 Recursos de SEO e GEO (Otimização para IAs)

O BugPress 2026 foi otimizado nativamente para motores de busca tradicionais (Google) e novos buscadores gerativos baseados em IA (Perplexity, ChatGPT, Gemini):
- **JSON-LD Schema.org**: Injeção estruturada automática dos schemas `NewsArticle` e `Organization` nas notícias e página inicial.
- **URLs Amigáveis**: Estrutura dinâmica de leitura de notícias baseada em `/noticia/{slug}`.
- **Sitemap Dinâmico**: Geração em tempo real do arquivo `/sitemap.xml` consumindo os artigos da API de forma resiliente (com fallback para páginas estáticas se a API estiver offline).
- **Robots.txt Dinâmico**: Regras inteligentes em `/robots.txt` desativando a indexação do painel admin (`/admin/*`).
- **SEO/GEO Local**: Tags de geolocalização física integradas (`geo.region`, `geo.position` centralizados em São Paulo, SP).

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- .NET 8.0 SDK ou superior
- Node.js (v18+) e npm
- PostgreSQL rodando localmente ou remotamente

---

### Passo 1: Executar o Backend (API)

1. Entre no diretório do backend:
   ```bash
   cd BugPress.API
   ```
2. Configure a string de conexão do PostgreSQL no arquivo `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Database=bugpress;Username=seu_usuario;Password=sua_senha"
   }
   ```
3. Instale a ferramenta `dotnet-ef` globalmente (se já não tiver):
   ```bash
   dotnet tool install -g dotnet-ef
   ```
4. Execute as migrations para criar a estrutura de tabelas e índices de unicidade no PostgreSQL:
   ```bash
   dotnet ef database update
   ```
5. Rode a API:
   ```bash
   dotnet run
   ```
   A API estará ativa em `http://localhost:5000` (HTTP) e `https://localhost:7144` (HTTPS). Você pode acessar a documentação interativa das rotas pelo Swagger em `http://localhost:5000/swagger`.

---

### Passo 2: Executar o Frontend (Web)

1. Entre no diretório do frontend:
   ```bash
   cd bugpress-web
   ```
2. Instale as dependências de pacotes do Next.js:
   ```bash
   npm install
   ```
3. Defina a variável de ambiente para a URL da API (ou use o fallback padrão):
   ```bash
   # Crie um arquivo .env.local
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:3000`.

---

## 🛡️ Segurança e Testes
Durante o ciclo de desenvolvimento, o código foi validado por meio dos scripts integrados do **Antigravity Kit**:
- Varredura de segurança contra brechas estáticas e vazamentos: `security_scan.py`
- Linter de integridade do código: `lint_runner.py`
