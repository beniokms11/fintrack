import { Category, Quote, WalletType } from './types'

// ============================================
// Default Transaction Categories
// ============================================

export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id' | 'user_id' | 'created_at'>[] = [
  { name: 'Alimentation', icon: '🍽️', color: '#F97316', type: 'expense', is_default: true },
  { name: 'Transport', icon: '🚗', color: '#3B82F6', type: 'expense', is_default: true },
  { name: 'Loyer', icon: '🏠', color: '#8B5CF6', type: 'expense', is_default: true },
  { name: 'Santé', icon: '🏥', color: '#EF4444', type: 'expense', is_default: true },
  { name: 'Loisirs', icon: '🎮', color: '#EC4899', type: 'expense', is_default: true },
  { name: 'Éducation', icon: '📚', color: '#6366F1', type: 'expense', is_default: true },
  { name: 'Famille', icon: '👨‍👩‍👧', color: '#14B8A6', type: 'expense', is_default: true },
  { name: 'Recharge / Internet', icon: '📱', color: '#06B6D4', type: 'expense', is_default: true },
  { name: 'Mobile Money', icon: '💸', color: '#F59E0B', type: 'expense', is_default: true },
  { name: 'Business', icon: '💼', color: '#10B981', type: 'expense', is_default: true },
  { name: 'Tontine / Épargne', icon: '🏦', color: '#0EA5E9', type: 'expense', is_default: true },
  { name: 'Autre', icon: '📌', color: '#6B7280', type: 'expense', is_default: true },
]

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id' | 'user_id' | 'created_at'>[] = [
  { name: 'Salaire', icon: '💰', color: '#10B981', type: 'income', is_default: true },
  { name: 'Vente', icon: '🛒', color: '#F97316', type: 'income', is_default: true },
  { name: 'Business', icon: '💼', color: '#3B82F6', type: 'income', is_default: true },
  { name: 'Freelance', icon: '💻', color: '#8B5CF6', type: 'income', is_default: true },
  { name: 'Transfert reçu', icon: '📩', color: '#14B8A6', type: 'income', is_default: true },
  { name: 'Autre', icon: '📌', color: '#6B7280', type: 'income', is_default: true },
]

// ============================================
// Wallet Configuration
// ============================================

export const WALLET_CONFIG: Record<WalletType, { name: string; icon: string; color: string }> = {
  cash: { name: 'Espèces', icon: '💵', color: '#10B981' },
  mtn_momo: { name: 'MTN MoMo', icon: '📱', color: '#FFCC00' },
  moov_money: { name: 'Moov Money', icon: '📱', color: '#0066CC' },
  bank: { name: 'Banque', icon: '🏦', color: '#6366F1' },
  savings: { name: 'Épargne', icon: '🐖', color: '#F59E0B' },
}

// ============================================
// Motivational Quotes (French)
// ============================================

export const QUOTES: Quote[] = [
  { text: "L'argent que tu ne suis pas, finit toujours par te quitter.", author: 'Proverbe financier' },
  { text: "La liberté financière commence par la conscience financière.", author: 'FinTrack' },
  { text: "Petit à petit, l'oiseau fait son nid.", author: 'Proverbe africain' },
  { text: "Ne dépense pas ce que tu n'as pas encore gagné.", author: 'Proverbe africain' },
  { text: "Celui qui épargne aujourd'hui, vivra mieux demain.", author: 'Proverbe financier' },
  { text: "La richesse n'est pas dans ce que tu gagnes, mais dans ce que tu gardes.", author: 'FinTrack' },
  { text: "Un budget n'est pas une contrainte, c'est un plan de liberté.", author: 'FinTrack' },
  { text: "Chaque franc compte. Chaque suivi aussi.", author: 'FinTrack' },
  { text: "Le meilleur moment pour épargner était hier. Le deuxième meilleur, c'est maintenant.", author: 'FinTrack' },
  { text: "Connais tes dépenses, maîtrise ta vie.", author: 'FinTrack' },
]

// ============================================
// Chart Configuration
// ============================================

export const CHART_PERIODS = [
  { key: '7d' as const, label: '7 jours' },
  { key: '30d' as const, label: '30 jours' },
  { key: '3m' as const, label: '3 mois' },
  { key: '12m' as const, label: '12 mois' },
]

// ============================================
// App Navigation
// ============================================

export const NAV_ITEMS = [
  { key: 'home', label: 'Accueil', href: '/', icon: 'Home' },
  { key: 'history', label: 'Historique', href: '/transactions', icon: 'ClockArrowUp' },
  { key: 'add', label: 'Ajouter', href: '#add', icon: 'Plus' },
  { key: 'budgets', label: 'Budgets', href: '/budgets', icon: 'PieChart' },
  { key: 'more', label: 'Plus', href: '/more', icon: 'Menu' },
]
