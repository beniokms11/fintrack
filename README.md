# FinTrack 📊

**Application de suivi financier personnel pour les utilisateurs francophones en Afrique de l'Ouest.**

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
- **Styling** : Tailwind CSS v4 + CSS custom properties
- **Graphiques** : Recharts
- **IA** : Groq (llama-3.3-70b-versatile)
- **Icônes** : Lucide React

## 📂 Structure du projet

```
src/
├── app/
│   ├── api/ai/          # Routes API IA (chat, insights, categorize)
│   ├── assistant/       # Page assistant IA
│   ├── budgets/         # Page budgets
│   ├── export/          # Page export CSV
│   ├── more/            # Page menu "Plus"
│   ├── savings/         # Page objectifs d'épargne
│   ├── settings/        # Page paramètres
│   ├── stats/           # Page statistiques
│   ├── transactions/    # Page historique
│   ├── wallets/         # Page portefeuilles
│   ├── globals.css      # Design system complet
│   ├── layout.tsx       # Layout racine
│   └── page.tsx         # Dashboard
├── components/
│   ├── dashboard/       # Composants du tableau de bord
│   ├── navigation/      # Navigation mobile
│   ├── providers/       # ThemeProvider, AppProvider
│   └── transactions/    # Modal d'ajout de transaction
├── lib/
│   ├── constants.ts     # Catégories, wallets, quotes
│   ├── mock-data.ts     # Données de développement
│   ├── types.ts         # Types TypeScript
│   └── utils.ts         # Utilitaires (formatXOF, formatDate, etc.)
└── public/
    └── manifest.json    # Configuration PWA
```

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

- [ ] Authentification (Supabase Auth)
- [ ] Base de données (Supabase PostgreSQL)
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
