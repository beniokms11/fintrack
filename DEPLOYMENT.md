# FinTrack - Déploiement (Instructions)

L'application est prête. Voici comment la mettre en ligne, avec une priorité pour **Netlify** comme demandé.

## 1. Déploiement sur Netlify (Recommandé)

### Pré-requis
- Un compte [Netlify](https://www.netlify.com/).
- Le fichier `netlify.toml` est déjà présent dans ton projet.

### Étapes
1.  **Connecter GitHub** : Crée un nouveau site sur Netlify et lie-le à ton dépôt GitHub.
2.  **Configuration du Build** :
    - Build Command : `npm run build`
    - Publish Directory : `.next`
    - Node Version : `20` (déjà géré par le `netlify.toml`).
3.  **Variables d'Environnement** : Va dans **Site Settings > Core > Environment variables** et ajoute :
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `GROQ_API_KEY`
4.  **Déployer** : Clique sur **Deploy site**.

## 2. Déploiement sur Vercel (Alternative)

Tu dois ajouter les variables suivantes dans ton projet Vercel (Settings > Environment Variables) :

| Variable | Description | Source |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de ton projet Supabase | Supabase Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anonyme | Supabase Project Settings > API |
| `GROQ_API_KEY` | Clé API pour l'intelligence artificielle | [Groq Console](https://console.groq.com/keys) |

## 2. Base de Données (Supabase SQL)

Si tu ne l'as pas encore fait, assure-toi d'avoir exécuté le script complet se trouvant dans `supabase_schema.sql` (disponible dans tes artefacts) dans ton éditeur SQL Supabase.

> [!IMPORTANT]
> Vérifie bien que tu as ajouté les colonnes `icon` et `color` à la table `savings_goals` comme conseillé précédemment.

## 3. Déploiement

1.  Connecte ton dépôt GitHub à Vercel.
2.  Vercel détectera automatiquement le framework Next.js.
3.  Clique sur **Deploy**.

## 4. Ce qui fonctionne (Validé)

- [x] **Authentification SSR** : Connexion et session persistante.
- [x] **Gestion Multi-Comptes** : Portefeuilles dynamiques.
- [x] **Transactions** : Ajout de revenus et dépenses avec mise à jour du solde.
- [x] **Budgets** : Suivi de progression par catégorie.
- [x] **Objectifs d'Épargne** : Création, gestion et ajout de fonds (avec interface fluide).
- [x] **Assistant IA** : Chat en temps réel et insights automatiques (Groq).
- [x] **PWA** : Prêt pour l'installation sur mobile (Manifest & Service Worker).

---
*FinTrack : Ton intelligence financière au bout des doigts.*
