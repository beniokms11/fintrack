# FinTrack 📊

**Application de suivi financier personnel pour les utilisateurs francophones en Afrique de l'Ouest.**

---

## 📦 Contenu du dépôt

Ce dépôt contient le code source complet de **FinTrack**, une Progressive Web App (PWA) de gestion financière personnelle construite avec **Next.js 15**, **React 19** et **TypeScript**, connectée à **Supabase** pour la persistance des données et à **Groq AI** pour les fonctionnalités d'intelligence artificielle.

### Ce que vous trouverez ici :

| Catégorie | Contenu |
|---|---|
| 📱 **Application Next.js** | 14 pages (dashboard, transactions, budgets, portefeuilles, épargne, statistiques, assistant IA, paramètres ×4, export, more, auth) |
| 🔌 **API Routes** | 3 endpoints IA : `/api/ai/chat`, `/api/ai/insights`, `/api/ai/categorize` |
| 🧩 **Composants React** | 15 composants (7 dashboard, 5 modales, 1 navigation, 2 providers) |
| 🗃️ **Gestion d'état** | `AppProvider` (React Context) + `ThemeProvider` pour la gestion centralisée de l'état |
| 📐 **Types TypeScript** | Modèles complets : `Transaction`, `Wallet`, `Category`, `Budget`, `SavingsGoal`, `Profile` |
| 🔧 **Utilitaires** | Fonctions de formatage FCFA, dates relatives, constantes (catégories, icônes, citations) |
| 🗄️ **Intégration Supabase** | Authentification, base de données PostgreSQL, SSR, middleware de session |
| 🤖 **Intégration Groq AI** | Chatbot financier, génération d'insights, catégorisation automatique des transactions |
| 🎨 **Design System** | Tailwind CSS v4 + variables CSS personnalisées, thème sombre/clair, animations Framer Motion |
| 📊 **Graphiques** | Courbe de suivi financier (revenus/dépenses/solde) avec Recharts |
| 📲 **PWA** | `manifest.json`, installable sur mobile |
| 🚀 **Configuration déploiement** | `netlify.toml`, `next.config.mjs`, `DEPLOYMENT.md` |

### Structure du code source (`src/`) :

```
src/
├── app/
│   ├── (auth)/login/        # Page de connexion (Supabase Auth)
│   ├── api/ai/              # Routes API IA (chat, insights, categorize)
│   ├── assistant/           # Page assistant IA (chatbot Groq)
│   ├── budgets/             # Gestion des budgets par catégorie
│   ├── export/              # Export des données en CSV
│   ├── more/                # Menu "Plus" (navigation secondaire)
│   ├── savings/             # Objectifs d'épargne
│   ├── settings/            # Paramètres (profil, sécurité, aide)
│   ├── stats/               # Statistiques financières
│   ├── transactions/        # Historique avec recherche et filtres
│   ├── wallets/             # Gestion multi-portefeuilles
│   ├── globals.css          # Design system (variables CSS, thèmes)
│   ├── layout.tsx           # Layout racine avec providers
│   └── page.tsx             # Dashboard (page d'accueil)
├── components/
│   ├── dashboard/           # StatsCards, TrackingCurve, BudgetProgress, TopCategories, AIInsightCard…
│   ├── navigation/          # BottomNav (navigation mobile)
│   ├── providers/           # AppProvider (état global), ThemeProvider
│   ├── budgets/             # AddBudgetModal
│   ├── savings/             # AddSavingsModal, AddFundsModal
│   ├── transactions/        # AddTransactionModal
│   └── wallets/             # AddWalletModal
├── lib/
│   ├── constants.ts         # Catégories par défaut, types de portefeuilles, citations
│   ├── mock-data.ts         # Données de développement
│   ├── supabase/            # Clients Supabase (browser, server, middleware)
│   ├── types.ts             # Tous les types TypeScript du projet
│   └── utils.ts             # formatXOF(), formatDate(), calculs utilitaires
├── middleware.ts             # Middleware Next.js (gestion de session)
└── utils/supabase/          # Utilitaires SSR Supabase
```

---

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
# Créer un fichier .env.local avec :
GROQ_API_KEY=ta_clé_groq_ici

# 3. Lancer le serveur de développement
npm run dev

# 4. Ouvrir http://localhost:3000
```

## 📱 Fonctionnalités

| Fonctionnalité | Statut |
|---|---|
| Dashboard avec KPIs | ✅ |
| Ajout de transactions (revenus/dépenses) | ✅ |
| Historique avec recherche et filtres | ✅ |
| Multi-portefeuilles (Cash, MoMo, Moov, Banque, Épargne) | ✅ |
| Catégories (14 par défaut) | ✅ |
| Budgets avec barres de progression | ✅ |
| Objectifs d'épargne | ✅ |
| Courbe de suivi financier (Recharts) | ✅ |
| Assistant IA (Groq - llama-3.3-70b) | ✅ |
| Insights IA | ✅ |
| Export CSV | ✅ |
| Mode sombre/clair | ✅ |
| Interface 100% française | ✅ |
| Devise FCFA (XOF) | ✅ |
| PWA (installable sur mobile) | ✅ |

## 🏗️ Stack technique

- **Frontend** : Next.js 15 + React 19 + TypeScript
- **Styling** : Tailwind CSS v4 + CSS custom properties + Framer Motion
- **Graphiques** : Recharts
- **Backend / Auth / BDD** : Supabase (PostgreSQL, Auth SSR)
- **IA** : Groq (llama-3.3-70b-versatile)
- **Icônes** : Lucide React
- **PWA** : manifest.json (installable sur mobile)

## 🎨 Personnalisation

### Changer la couleur accent
Dans `globals.css`, modifier `--color-accent` :
```css
:root {
  --color-accent: #10B981; /* Émeraude (actuel) */
}
```

### Ajouter des catégories
Dans `lib/constants.ts`, ajouter dans `DEFAULT_EXPENSE_CATEGORIES` ou `DEFAULT_INCOME_CATEGORIES`.

### Modifier les citations
Dans `lib/constants.ts`, modifier le tableau `QUOTES`.

### Changer le modèle IA
Dans `app/api/ai/chat/route.ts`, modifier le champ `model` :
```typescript
model: 'llama-3.3-70b-versatile', // Changer ici
```

## 🚀 Déploiement (Vercel)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Ajouter la variable d'environnement dans Vercel Dashboard
# GROQ_API_KEY = ta_clé
```

## 📋 Version 2 (à venir)

- [ ] Transactions récurrentes
- [ ] Export PDF
- [ ] Upload de reçus (OCR)
- [ ] Notifications push
- [ ] Module Tontine
- [ ] Multi-devise
- [ ] Partage de budget en famille
- [ ] Analyses avancées (année par année)

---

**FinTrack** — Connais tes dépenses, maîtrise ta vie. 🌍
