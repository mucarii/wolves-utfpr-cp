# Wolves UTFPR-CP — Site Oficial

Site oficial do time de futebol americano **Wolves UTFPR-CP**, da Universidade Tecnológica Federal do Paraná — Câmpus Cornélio Procópio.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 + Vite 8 |
| Estilização | Tailwind CSS 4 |
| Roteamento | React Router DOM 7 |
| Backend/DB | Firebase (Firestore, Auth, Storage) |
| Testes | Vitest + Testing Library |
| Deploy | Vercel |

---

## Funcionalidades

### Site público

- **Home** — carrossel hero com as últimas notícias (ou notícias em destaque selecionadas pelos admins) + cards de notícias recentes
- **Notícias** — listagem de notícias com filtro por categoria (Jogo, Treino, Evento, Flag Football, Extensão, Geral)
- **Time** — elenco completo com foto, número, posição e modalidade; formações táticas
- **Modalidades** — apresentação das modalidades do clube (Full Pad e Flag Football)
- **Treinos** — horários e local dos treinos
- **Extensão** — projetos de extensão universitária
- **Loja** — produtos com carrinho persistente (localStorage), checkout via PIX e envio de comprovante pelo WhatsApp
- **Contato** — informações de contato e formulário que abre conversa direta no WhatsApp
- **Busca** — overlay de busca na navbar filtra páginas e notícias em tempo real

### Painel administrativo (`/admin`)

Acesso restrito por autenticação Firebase. Seções disponíveis:

| Seção | O que gerencia |
|-------|---------------|
| Notícias | Publicar, destacar no carrossel e remover notícias |
| Jogadores | Cadastrar, editar e remover jogadores; montar formações táticas |
| Loja | Cadastrar e remover produtos; definir chave PIX |
| Fotos | Upload e remoção de fotos da galeria |
| Eventos | Cadastrar e remover eventos |
| Diretoria | Cadastrar e remover membros da diretoria |
| Contato | Editar informações de contato e número do WhatsApp |

---

## Estrutura do projeto

```
src/
├── components/
│   ├── ErrorBoundary.jsx   # Captura erros de runtime
│   ├── HeroSection.jsx     # Carrossel da home (busca notícias no Firestore)
│   ├── Navbar.jsx          # Navegação + busca global
│   ├── NewsCards.jsx       # Cards de notícias recentes
│   ├── Footer.jsx
│   ├── NavigationTabs.jsx
│   ├── ProtectedRoute.jsx
│   └── SocialLinks.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── NoticiasPage.jsx
│   ├── TimePage.jsx
│   ├── LojaPage.jsx        # Carrinho + checkout PIX
│   ├── ContatoPage.jsx
│   ├── TreinosPage.jsx
│   ├── ModalidadesPage.jsx
│   ├── ExtensaoPage.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx
│       ├── AdminNoticias.jsx
│       ├── AdminJogadores.jsx
│       ├── AdminLoja.jsx
│       ├── AdminFotos.jsx
│       ├── AdminEventos.jsx
│       ├── AdminDiretoria.jsx
│       └── AdminContato.jsx
├── contexts/
│   └── AuthContext.jsx
├── constants.js            # Posições, cores por posição, badges de categoria
├── utils/
│   └── price.js            # parsePrice, formatPrice, cartTotal, cartCount
└── firebase.js
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> O arquivo `.env` está no `.gitignore` e nunca deve ser commitado.

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

### 4. Build para produção

```bash
npm run build
```

### 5. Testes

```bash
npm run test       # modo watch
npm run test:run   # execução única
```

---

## Deploy (Vercel)

1. Conecte o repositório no [Vercel](https://vercel.com)
2. Em **Settings → Environment Variables**, adicione todas as variáveis `VITE_FIREBASE_*`
3. O deploy ocorre automaticamente a cada push na branch `main`

---

## Coleções do Firestore

| Coleção | Campos principais |
|---------|------------------|
| `noticias` | `titulo`, `resumo`, `conteudo`, `categoria`, `url`, `destaque`, `criadoEm` |
| `jogadores` | `nome`, `numero`, `posicao`, `modalidade`, `url`, `criadoEm` |
| `formacoes` | `nome`, `modalidade`, `posicoes[]` |
| `produtos` | `nome`, `descricao`, `preco`, `url`, `criadoEm` |
| `fotos` | `url`, `storageRef`, `criadoEm` |
| `eventos` | `titulo`, `descricao`, `data`, `url`, `criadoEm` |
| `diretoria` | `nome`, `cargo`, `url`, `criadoEm` |
| `config/contato` | `whatsapp`, `email`, `instagram`, `pix` |

---

## Acesso admin

Rota: `/admin/login`

O cadastro de usuários admin é feito diretamente no console do Firebase Authentication.
