<div align="center">
  <img src="./src/assets/images/logo/nero-320.png" 
       alt="Nero Mobile" width="200" />
  
  <h1>Nero Mobile</h1>
  <p>Aplicativo mobile de e-commerce de moda — construído com performance e experiência nativa de ponta</p>

  ![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react)
  ![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
  ![NativeWind](https://img.shields.io/badge/NativeWind-4.x-38BDF8?style=flat-square)
  ![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=flat-square)
  ![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)
  ![Better Auth](https://img.shields.io/badge/Better_Auth-Sessions-FF6B6B?style=flat-square)
  ![Zustand](https://img.shields.io/badge/Zustand-5.x-FF6B00?style=flat-square)
</div>

---

### 2. Visão Geral

O **Nero Mobile** é o aplicativo cliente do ecossistema Nero — um e-commerce de moda focado em experiência nativa premium para Android e iOS. Consome toda a infraestrutura da `nero-api` via cliente HTTP gerado automaticamente com Orval, garantindo contratos de tipo End-to-End entre backend e frontend.

O app cobre o fluxo completo de compra: autenticação (email/senha e Google OAuth), navegação de catálogo, página de produto com variações de SKU, wishlist, carrinho, checkout com Stripe, acompanhamento de pedidos e gerenciamento de perfil com upload de avatar.

---

### 3. Decisões Técnicas

- **Por que Expo com expo-router e não React Native CLI?**
  **Escolha:** Expo SDK 54 com `expo-router` (file-based routing) e EAS Build.
  **Motivo:** Expo elimina configuração nativa manual de Gradle/Xcode para a maioria dos casos, acelera o CI/CD com EAS Cloud Builds e o `expo-dev-client` permite builds de desenvolvimento customizados sem sacrificar o acesso às APIs nativas (Stripe, Google Sign-In). O `expo-router` traz o mesmo paradigma de rotas baseado em arquivos do Next.js, tornando a estrutura de navegação previsível e escalável.
  **Descartado:** React Native CLI puro exige configuração manual de linking, mais overhead de manutenção de dependências nativas e ambiente menos padronizado entre máquinas da equipe.

- **Por que NativeWind (TailwindCSS) e não StyleSheet puro?**
  **Escolha:** NativeWind v4 + Tailwind CSS v3 + `tailwind-variants` para composição.
  **Motivo:** A syntaxe de utilitários do Tailwind acelera dramaticamente a construção de UI responsiva com tokens de design centralizados. O `tailwind-variants` resolve a composição de variantes de componentes (ex.: botões com variantes `primary`, `destructive`) de forma type-safe, sem explosão de `if/else` em props de estilo.
  **Descartado:** StyleSheet nativo é verboso e não compartilha design tokens facilmente. Styled Components adiciona overhead de runtime e não tem suporte nativo ao "tree shaking" de estilos.

- **Por que TanStack Query + Orval e não fetch puro ou SWR?**
  **Escolha:** TanStack Query v5 para caching/estado servidor e `Orval` para geração automática do cliente HTTP.
  **Motivo:** Orval lê o schema OpenAPI da `nero-api` e gera typings, hooks de query e mutations totalmente sincronizados com o backend — eliminando toda manutenção manual de tipos de API e duplicação de contratos. TanStack Query garante cache inteligente com `staleTime`, `gcTime` e `retry` configuráveis, além de integração nativa com o `MutationCache` para toast notifications globais.
  **Descartado:** SWR tem ecossistema menor para React Native. Fetch manual não oferece cache, deduplicação de requisições ou invalidação reativa.

- **Por que Better Auth Expo e não JWT manual?**
  **Escolha:** `@better-auth/expo` + `expo-secure-store` para armazenamento seguro do token de sessão.
  **Motivo:** Better Auth gerencia toda a lifecycle de sessão (refresh, expiração, revogação) de forma stateful no backend. O adapter Expo serializa e persiste a sessão de forma segura no Keychain (iOS) / Keystore (Android) via `expo-secure-store`, sem expor tokens em `AsyncStorage` não cifrado.

- **Por que Zustand e não Context API ou Redux?**
  **Escolha:** Zustand v5 para estado global de UI (carrinho temporário, pesquisa, autenticação local).
  **Motivo:** Zustand não requer Provider wrapper para cada slice de estado, é extremamente leve (< 1kB) e o padrão de `set` com seletor elimina re-renders desnecessários sem a complexidade de `useMemo`/`useCallback` forçados do Context. Para estado derivado do servidor, o TanStack Query é quem controla — Zustand fica apenas para estado de UI puro.

- **Por que Stripe React Native com SetupIntent?**
  **Escolha:** `@stripe/stripe-react-native` com fluxo SetupIntent para salvar cartões + PaymentIntent para cobranças.
  **Motivo:** O SDK nativo do Stripe expõe UI sheets nativas (Apple Pay / Google Pay) sem precisar implementar formulários de cartão do zero. O modelo SetupIntent respeita o PCI Compliance mantendo dados sensíveis fora dos servidores da Nero, delegando confirmação final ao SDK nativo do Stripe.

---

### 4. Arquitetura

```text
src/
├── app/                   # Rotas file-based (expo-router)
│   ├── _layout.tsx        # Root layout — monta providers globais
│   ├── index.tsx          # Redirect guard (auth vs. home)
│   ├── (auth)/            # Grupo de rotas públicas de autenticação
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   ├── otp.tsx
│   │   ├── reset-password.tsx
│   │   └── preferences.tsx
│   └── (private)/         # Grupo de rotas protegidas
│       └── (tabs)/        # Bottom Tab Navigator
│           ├── home.tsx
│           ├── cart.tsx
│           ├── search.tsx
│           ├── wishlist.tsx
│           ├── categories.tsx
│           ├── profile.tsx
│           ├── address.tsx
│           ├── product/[slug].tsx
│           ├── products-by-category/
│           ├── orders/[id].tsx
│           ├── checkout/
│           │   ├── index.tsx    # Resumo do pedido
│           │   ├── address.tsx  # Seleção de endereço
│           │   └── payment.tsx  # Seleção de pagamento
│           └── profile/
│               └── edit.tsx
├── api/                   # Camada de comunicação com a nero-api
│   ├── generated/         # Cliente HTTP gerado via Orval (OpenAPI)
│   └── interceptors.ts    # Axios instance + injeção de sessão
├── components/
│   ├── gluestack/         # Componentes base do Gluestack UI
│   └── ui/                # Componentes customizados da Nero
├── constants/             # Assets estáticos (ícones, imagens)
├── hooks/                 # Hooks reutilizáveis por feature
│   ├── addresses/
│   ├── auth/
│   ├── products/
│   ├── users/
│   ├── wishlist/
│   └── use-safe-back.ts
├── lib/                   # Instâncias de clientes externos
│   ├── auth-client.ts     # Instância Better Auth para Expo
│   └── google.ts          # Configuração Google Sign-In
├── providers/             # Wrappers de contexto globais
│   ├── root-provider.tsx  # QueryClient + Stripe + GluestackUI
│   └── auth-provider.tsx  # Sessão Better Auth + guard de sessão
├── schemas/               # Schemas Zod de validação de formulários
│   ├── auth/
│   ├── addresses/
│   └── users/
├── store/                 # Stores Zustand
│   ├── use-auth.store.ts
│   ├── use-cart-store.ts
│   └── use-search-store.ts
├── types/                 # Types TypeScript compartilhados
└── utils/                 # Utilitários puros
    ├── error-handler.ts
    └── masks.ts
```

**Fluxo End-to-End de uma tela:**
1. **Route** → `expo-router` resolve o arquivo de rota baseado no caminho. O guard no `auth-provider` redireciona para `/(auth)/login` se não houver sessão ativa.
2. **Data Fetching** → O componente consome hooks do TanStack Query gerados pelo Orval. O `interceptors.ts` injeta automaticamente o cookie de sessão do Better Auth em cada requisição Axios.
3. **State Global** → O Zustand provê estado de UI (quantidade do carrinho no badge, termo de busca etc.) sem acoplamento com o servidor.
4. **Mutations** → Ao mutar dados (ex.: adicionar ao carrinho), o `MutationCache` global invalida as queries relacionadas e dispara toasts de sucesso/erro via `sonner-native`.
5. **Payments** → O checkout emite o `PaymentIntent` para a `nero-api`, recebe o `clientSecret` e confirma via SDK nativo do Stripe sem expor dados do cartão ao app.

---

### 5. Telas e Rotas

#### Grupo Público — `(auth)`
Rotas acessíveis sem autenticação. Redireciona para `/(private)` após login.
| Rota | Tela | Descrição |
|------|------|-----------|
| `/login` | Login | Login via email/senha ou Google OAuth |
| `/register` | Cadastro | Criação de conta com validação Zod |
| `/forgot-password` | Esqueci a Senha | Solicita email para recuperação |
| `/otp` | Verificação OTP | Confirma código enviado por email |
| `/reset-password` | Redefinir Senha | Define nova senha após verificação |
| `/preferences` | Preferências | Seleção de gênero de moda na primeira entrada |

#### Grupo Privado — `(private)/(tabs)`
Protegido pelo `auth-provider`. Requer sessão ativa do Better Auth.
| Rota | Tela | Descrição |
|------|------|-----------|
| `/home` | Home | Banners, seções dinâmicas (New In, Top Vendas) vindas do backend |
| `/search` | Busca | FTS com filtros de categoria, preço e ordenação |
| `/categories` | Categorias | Grade de categorias e subcategorias navegáveis |
| `/product/[slug]` | PDP - Produto | Galeria, variações de SKU (tamanho/cor), avaliações |
| `/products-by-category` | Listagem por Categoria | Grid paginado de produtos filtrados |
| `/cart` | Carrinho | Itens, quantidades, cupom e subtotal em tempo real |
| `/wishlist` | Lista de Desejos | Produtos favoritados com toggle de like |
| `/address` | Meus Endereços | Lista e exclusão de endereços cadastrados |
| `/checkout` | Resumo do Checkout | Review de itens, valor total, frete |
| `/checkout/address` | Endereço de Entrega | Seleção ou adição de endereço para o pedido |
| `/checkout/payment` | Pagamento | Seleção do método de pagamento salvo no Stripe |
| `/orders` | Meus Pedidos | Histórico de pedidos do usuário |
| `/orders/[id]` | Detalhe do Pedido | Status, rastreio e itens do pedido (snapshot imutável) |
| `/profile` | Perfil | Avatar, dados pessoais e ações da conta |
| `/profile/edit` | Editar Perfil | Atualização de nome, telefone e preferências |

---

### 6. Geração do Cliente de API (Orval)

O cliente HTTP é **gerado automaticamente** a partir do schema OpenAPI exposto pela `nero-api`. Isso garante que os tipos do frontend estejam sempre sincronizados com o backend sem manutenção manual.

**Como funciona:**
1. O `orval.config.ts` aponta para `EXPO_PUBLIC_API_URL/swagger.json`.
2. O Orval lê o schema e gera: hooks TanStack Query, tipos TypeScript e chamadas Axios.
3. Os arquivos gerados ficam em `src/api/generated/`.
4. O `src/api/interceptors.ts` injeta o cookie/token de sessão do Better Auth em todas as requisições.

```bash
# Regenerar o cliente (requer a nero-api rodando)
pnpm generate-api
```

> [!IMPORTANT]
> Execute `pnpm generate-api` sempre que houver mudanças no schema da `nero-api` para manter os tipos sincronizados.

---

### 7. Variáveis de Ambiente

O Expo exige o prefixo `EXPO_PUBLIC_` para expor variáveis ao bundle do cliente. Configure no arquivo `.env` na raiz do projeto.

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `EXPO_PUBLIC_API_URL` | ✅ | URL base da `nero-api` (ex.: `http://192.168.0.x:8000` local ou URL de produção) |
| `EXPO_PUBLIC_BETTER_AUTH_URL` | ✅ | URL do servidor Better Auth (geralmente igual à `API_URL`) |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Chave pública do Stripe (`pk_test_...` em dev, `pk_live_...` em prod) |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | ✅ | Client ID OAuth do Google Console para Android |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | ✅ | Client ID OAuth do Google Console para Web (usado internamente pelo SDK) |

> [!WARNING]
> Nunca coloque chaves secretas com prefixo `EXPO_PUBLIC_` — elas ficam embutidas no bundle do app e são acessíveis publicamente. Apenas chaves **publicáveis** (como a `pk_` do Stripe) devem ser expostas aqui.

---

### 8. Como Rodar Localmente

#### Pré-requisitos
- Node.js 20+
- pnpm 10+
- `expo-cli` (via `npx expo`) ou Expo Go instalado no dispositivo físico/emulador
- `nero-api` rodando localmente ou apontando para a URL de staging
- Android Studio (para emulador Android) ou Xcode (para simulador iOS)

#### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/willianOliveira-dev/nero-mobile.git
cd nero-mobile

# 2. Instale as dependências com pnpm
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# [!] Preencha com a URL da nero-api rodando, chaves do Stripe e Google OAuth

# 4. Inicie o servidor de desenvolvimento Expo
pnpm start
```

#### Rodando em Dispositivo/Emulador

```bash
# Android (emulador ou dispositivo físico via USB)
pnpm android

# iOS (simulador — requer macOS e Xcode)
pnpm ios

# Web (modo experimental)
pnpm web
```

> [!NOTE]
> Para rodar com o **dev client** (necessário para módulos nativos como Stripe e Google Sign-In), use `expo-dev-client`. O `Expo Go` **não suporta** todos os módulos nativos utilizados neste projeto.

---

### 9. Build e Deploy com EAS

O projeto está configurado para builds em nuvem com [EAS Build](https://docs.expo.dev/build/introduction/) (`eas.json`).

```bash
# Build de desenvolvimento (dev-client para testes internos)
eas build --profile development --platform android

# Build de preview (APK para testes externos)
eas build --profile preview --platform android

# Build de produção (AAB para Google Play Store)
eas build --profile production --platform android
```

---

### 10. Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm start` | Inicia o servidor Metro Bundler do Expo |
| `pnpm android` | Abre o app no emulador/dispositivo Android |
| `pnpm ios` | Abre o app no simulador iOS |
| `pnpm web` | Abre o app no navegador (experimental) |
| `pnpm generate-api` | Regenera o cliente HTTP via Orval lendo o schema da nero-api |
| `pnpm lint` | Executa ESLint com as regras do `eslint-config-expo` |
| `pnpm reset-project` | Limpa o projeto voltando ao estado inicial do Expo |

---

### 11. Stack de Tecnologias

| Camada | Tecnologia | Versão | Função |
|--------|-----------|--------|--------|
| **Runtime** | React Native | 0.81 | Framework mobile cross-platform |
| **Framework** | Expo SDK | ~54 | Toolchain, plugins e módulos nativos |
| **Roteamento** | expo-router | ~6 | File-based routing com deep links |
| **Estilização** | NativeWind | 4.x | TailwindCSS para React Native |
| **Componentes UI** | Gluestack UI | 3.x | Sistema de componentes acessíveis |
| **Animações** | @legendapp/motion | 2.x | Animações performáticas com Reanimated |
| **Animações Avançadas** | React Native Skia | 2.x | Canvas 2D nativo para efeitos visuais |
| **Gestos** | react-native-gesture-handler | ~2.28 | Gestos nativos e swipes |
| **Dados do Servidor** | TanStack Query | ^5 | Cache, sync e estado servidor |
| **Geração de API** | Orval | ^8 | Cliente HTTP type-safe via OpenAPI |
| **HTTP Client** | Axios | ^1 | Requisições HTTP com interceptors |
| **Estado Global** | Zustand | ^5 | Estado de UI leve e reativo |
| **Formulários** | React Hook Form + Zod | ^7 / ^4 | Formulários performáticos + validação |
| **Autenticação** | Better Auth Expo | ^1.5 | Sessão stateful, Google OAuth |
| **Google Sign-In** | @react-native-google-signin | ^16 | Login social Google nativo |
| **Pagamentos** | @stripe/stripe-react-native | 0.50 | SetupIntent + PaymentIntent nativo |
| **Armazenamento Seguro** | expo-secure-store | ^15 | Keychain/Keystore para tokens de sessão |
| **Storage Geral** | AsyncStorage | 2.2 | Cache persistido não sensível |
| **Ícones** | lucide-react-native | ^0.577 | Ícones SVG consistentes |
| **Toasts** | sonner-native | ^0.23 | Notificações de feedback global |
| **Tipografia** | Fredoka (Google Fonts) | — | Fonte primária do design system |
| **Imagens** | expo-image | ~3 | Carregamento otimizado com cache |
| **Upload de Imagens** | expo-image-picker | ~17 | Acesso à câmera e galeria |
| **Vídeos** | expo-video | ~3 | Reprodução de mídia nativa |

---

### 12. Licença e Autor

## Autor

**Willian Oliveira**
[![GitHub](https://img.shields.io/badge/GitHub-willianOliveira--dev-181717?style=flat-square&logo=github)](https://github.com/willianOliveira-dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Willian_Oliveira-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/willian-oliveira-66a230353/)
