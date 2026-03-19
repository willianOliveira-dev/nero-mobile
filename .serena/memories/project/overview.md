# Nero Mobile — Project Overview

## Purpose
Nero Mobile is a React Native e-commerce app for the fashion retail market. It is the mobile client for the Nero API backend. It allows users to browse products by categories and gender, search, view product details, manage a cart, and review products.

## Tech Stack
- **Framework**: Expo SDK 54 (expo-router v6 for file-based routing)
- **Language**: TypeScript (~5.9)
- **Styling**: NativeWind v4 + TailwindCSS v3 + Gluestack UI v3
- **State Management**: Zustand v5
- **Data Fetching**: TanStack Query v5 + Axios
- **API Client Generation**: Orval v8 (generates typed hooks from OpenAPI spec)
- **Forms**: React Hook Form v7 + Zod v4
- **Icons**: lucide-react-native
- **Images**: expo-image
- **Animations**: react-native-reanimated, @legendapp/motion
- **Auth**: better-auth + @better-auth/expo

## Codebase Structure
```
src/
├── api/
│   ├── generated/       # Orval-generated hooks (DO NOT EDIT)
│   │   ├── model/       # TypeScript types from OpenAPI
│   │   ├── products/    # Product hooks (searchProducts, getProductBySlug)
│   │   ├── categories/  # Category hooks (listCategories, getCategoryBySlug)
│   │   ├── brands/      # Brand hooks (listBrands, getBrand)
│   │   ├── cart/        # Cart hooks
│   │   ├── home/        # Home hooks
│   │   ├── orders/      # Orders hooks
│   │   ├── reviews/     # Reviews hooks
│   │   └── users/       # Users hooks
│   └── interceptors.ts  # Axios custom instance
├── app/                 # File-based routing (expo-router)
│   ├── (auth)/          # Auth screens (login, register, forgot-password)
│   ├── (public)/
│   │   └── (tabs)/      # Tab navigation
│   │       ├── home.tsx
│   │       ├── search.tsx
│   │       ├── cart.tsx
│   │       ├── profile.tsx
│   │       ├── categories.tsx (EMPTY - to implement)
│   │       ├── product/[slug].tsx
│   │       └── products-by-category/[id].tsx (EMPTY - to implement)
│   ├── index.tsx
│   └── _layout.tsx
├── components/
│   ├── gluestack/ui/    # Gluestack UI wrappers (Box, Text, HStack, VStack, etc.)
│   ├── reacticx/ui/     # Custom animated components (AnimatedInputBar, etc.)
│   └── ui/              # App-specific reusable components
├── config/              # Env configuration
├── constants/           # Icons, images
├── hooks/               # Custom hooks (auth, products)
├── lib/                 # Auth client, Google sign-in
├── providers/           # React providers (auth, root)
├── schemas/             # Zod schemas (auth)
├── store/               # Zustand stores (auth, cart, search)
├── theme/               # Theme-related files
├── types/               # TypeScript type declarations
└── utils/               # Utility functions
```

## Design System / Theme
- **Primary color**: `#d70040` (crimson red)
- **Secondary**: `#272727` (near-black)
- **Font**: Fredoka (Regular, Medium, SemiBold, Bold) + Oughter
- **Tailwind classes**: `font-fredoka`, `font-fredoka-medium`, `font-fredoka-semibold`, `font-fredoka-bold`
- **Background**: white/95 for screens
- **Border**: gray-100
