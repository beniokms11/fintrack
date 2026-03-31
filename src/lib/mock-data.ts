import { Transaction, Wallet, Category, Budget, SavingsGoal, DashboardStats, SpendingByCategory, ChartDataPoint, AIInsight } from './types'

// ============================================
// Mock Data for Development
// Will be replaced by Supabase queries
// ============================================

export const MOCK_WALLETS: Wallet[] = [
  { id: 'w1', user_id: 'u1', name: 'Espèces', type: 'cash', balance: 125000, icon: '💵', color: '#10B981', is_default: true, created_at: '2026-03-01' },
  { id: 'w2', user_id: 'u1', name: 'MTN MoMo', type: 'mtn_momo', balance: 85000, icon: '📱', color: '#FFCC00', is_default: false, created_at: '2026-03-01' },
  { id: 'w3', user_id: 'u1', name: 'Moov Money', type: 'moov_money', balance: 42000, icon: '📱', color: '#0066CC', is_default: false, created_at: '2026-03-01' },
  { id: 'w4', user_id: 'u1', name: 'Banque', type: 'bank', balance: 350000, icon: '🏦', color: '#6366F1', is_default: false, created_at: '2026-03-01' },
  { id: 'w5', user_id: 'u1', name: 'Épargne', type: 'savings', balance: 200000, icon: '🐖', color: '#F59E0B', is_default: false, created_at: '2026-03-01' },
]

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', user_id: null, name: 'Alimentation', icon: '🍽️', color: '#F97316', type: 'expense', is_default: true, created_at: '2026-01-01' },
  { id: 'c2', user_id: null, name: 'Transport', icon: '🚗', color: '#3B82F6', type: 'expense', is_default: true, created_at: '2026-01-01' },
  { id: 'c3', user_id: null, name: 'Loyer', icon: '🏠', color: '#8B5CF6', type: 'expense', is_default: true, created_at: '2026-01-01' },
  { id: 'c4', user_id: null, name: 'Santé', icon: '🏥', color: '#EF4444', type: 'expense', is_default: true, created_at: '2026-01-01' },
  { id: 'c5', user_id: null, name: 'Recharge / Internet', icon: '📱', color: '#06B6D4', type: 'expense', is_default: true, created_at: '2026-01-01' },
  { id: 'c6', user_id: null, name: 'Loisirs', icon: '🎮', color: '#EC4899', type: 'expense', is_default: true, created_at: '2026-01-01' },
  { id: 'c7', user_id: null, name: 'Famille', icon: '👨‍👩‍👧', color: '#14B8A6', type: 'expense', is_default: true, created_at: '2026-01-01' },
  { id: 'c8', user_id: null, name: 'Salaire', icon: '💰', color: '#10B981', type: 'income', is_default: true, created_at: '2026-01-01' },
  { id: 'c9', user_id: null, name: 'Vente', icon: '🛒', color: '#F97316', type: 'income', is_default: true, created_at: '2026-01-01' },
  { id: 'c10', user_id: null, name: 'Business', icon: '💼', color: '#3B82F6', type: 'income', is_default: true, created_at: '2026-01-01' },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', user_id: 'u1', wallet_id: 'w1', type: 'expense', amount: 3500, category_id: 'c1', description: 'Déjeuner au maquis', merchant: 'Chez Tantie', date: '2026-03-30', created_at: '2026-03-30T10:30:00', updated_at: '2026-03-30T10:30:00', category: MOCK_CATEGORIES[0], wallet: MOCK_WALLETS[0] },
  { id: 't2', user_id: 'u1', wallet_id: 'w2', type: 'expense', amount: 1500, category_id: 'c2', description: 'Taxi', merchant: null, date: '2026-03-30', created_at: '2026-03-30T08:15:00', updated_at: '2026-03-30T08:15:00', category: MOCK_CATEGORIES[1], wallet: MOCK_WALLETS[1] },
  { id: 't3', user_id: 'u1', wallet_id: 'w4', type: 'income', amount: 350000, category_id: 'c8', description: 'Salaire mars', merchant: 'Entreprise SA', date: '2026-03-28', created_at: '2026-03-28T09:00:00', updated_at: '2026-03-28T09:00:00', category: MOCK_CATEGORIES[7], wallet: MOCK_WALLETS[3] },
  { id: 't4', user_id: 'u1', wallet_id: 'w1', type: 'expense', amount: 75000, category_id: 'c3', description: 'Loyer mars', merchant: 'Bailleur', date: '2026-03-27', created_at: '2026-03-27T12:00:00', updated_at: '2026-03-27T12:00:00', category: MOCK_CATEGORIES[2], wallet: MOCK_WALLETS[0] },
  { id: 't5', user_id: 'u1', wallet_id: 'w2', type: 'expense', amount: 5000, category_id: 'c5', description: 'Forfait internet', merchant: 'MTN', date: '2026-03-26', created_at: '2026-03-26T14:30:00', updated_at: '2026-03-26T14:30:00', category: MOCK_CATEGORIES[4], wallet: MOCK_WALLETS[1] },
  { id: 't6', user_id: 'u1', wallet_id: 'w1', type: 'expense', amount: 2000, category_id: 'c1', description: 'Petit-déjeuner', merchant: null, date: '2026-03-26', created_at: '2026-03-26T07:30:00', updated_at: '2026-03-26T07:30:00', category: MOCK_CATEGORIES[0], wallet: MOCK_WALLETS[0] },
  { id: 't7', user_id: 'u1', wallet_id: 'w3', type: 'expense', amount: 15000, category_id: 'c4', description: 'Pharmacie', merchant: 'Pharmacie du Peuple', date: '2026-03-25', created_at: '2026-03-25T16:00:00', updated_at: '2026-03-25T16:00:00', category: MOCK_CATEGORIES[3], wallet: MOCK_WALLETS[2] },
  { id: 't8', user_id: 'u1', wallet_id: 'w2', type: 'income', amount: 45000, category_id: 'c9', description: 'Vente articles', merchant: 'Client B', date: '2026-03-24', created_at: '2026-03-24T11:00:00', updated_at: '2026-03-24T11:00:00', category: MOCK_CATEGORIES[8], wallet: MOCK_WALLETS[1] },
  { id: 't9', user_id: 'u1', wallet_id: 'w1', type: 'expense', amount: 8000, category_id: 'c7', description: 'Aide famille', merchant: null, date: '2026-03-23', created_at: '2026-03-23T15:00:00', updated_at: '2026-03-23T15:00:00', category: MOCK_CATEGORIES[6], wallet: MOCK_WALLETS[0] },
  { id: 't10', user_id: 'u1', wallet_id: 'w1', type: 'expense', amount: 4500, category_id: 'c6', description: 'Sortie avec amis', merchant: null, date: '2026-03-22', created_at: '2026-03-22T20:00:00', updated_at: '2026-03-22T20:00:00', category: MOCK_CATEGORIES[5], wallet: MOCK_WALLETS[0] },
]

export const MOCK_STATS: DashboardStats = {
  totalBalance: 802000,
  totalIncome: 395000,
  totalExpenses: 114500,
  totalSavings: 200000,
  balanceChange: 12.5,
}

export const MOCK_BUDGETS: Budget[] = [
  { id: 'b1', user_id: 'u1', category_id: 'c1', amount: 50000, period: 'monthly', created_at: '2026-03-01', spent: 32000, remaining: 18000, percentage: 0.64, category: MOCK_CATEGORIES[0] },
  { id: 'b2', user_id: 'u1', category_id: 'c2', amount: 30000, period: 'monthly', created_at: '2026-03-01', spent: 22000, remaining: 8000, percentage: 0.73, category: MOCK_CATEGORIES[1] },
  { id: 'b3', user_id: 'u1', category_id: 'c3', amount: 75000, period: 'monthly', created_at: '2026-03-01', spent: 75000, remaining: 0, percentage: 1.0, category: MOCK_CATEGORIES[2] },
  { id: 'b4', user_id: 'u1', category_id: 'c6', amount: 15000, period: 'monthly', created_at: '2026-03-01', spent: 4500, remaining: 10500, percentage: 0.3, category: MOCK_CATEGORIES[5] },
]

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: 's1', user_id: 'u1', name: 'Nouvel ordinateur', target_amount: 350000, current_amount: 200000, deadline: '2026-06-30', icon: '💻', color: '#3B82F6', created_at: '2026-01-15', updated_at: '2026-03-28' },
  { id: 's2', user_id: 'u1', name: 'Fonds d\'urgence', target_amount: 500000, current_amount: 150000, deadline: '2026-12-31', icon: '🛡️', color: '#10B981', created_at: '2026-01-01', updated_at: '2026-03-25' },
  { id: 's3', user_id: 'u1', name: 'Voyage', target_amount: 200000, current_amount: 45000, deadline: '2026-09-15', icon: '✈️', color: '#F59E0B', created_at: '2026-02-01', updated_at: '2026-03-20' },
]

export const MOCK_TOP_SPENDING: SpendingByCategory[] = [
  { category: MOCK_CATEGORIES[2], total: 75000, percentage: 0.42, count: 1 },
  { category: MOCK_CATEGORIES[0], total: 32000, percentage: 0.18, count: 5 },
  { category: MOCK_CATEGORIES[1], total: 22000, percentage: 0.12, count: 4 },
  { category: MOCK_CATEGORIES[3], total: 15000, percentage: 0.08, count: 1 },
  { category: MOCK_CATEGORIES[6], total: 8000, percentage: 0.04, count: 2 },
]

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { date: '2026-03-01', label: '1 Mars', balance: 650000, income: 0, expense: 0 },
  { date: '2026-03-05', label: '5 Mars', balance: 620000, income: 0, expense: 30000 },
  { date: '2026-03-08', label: '8 Mars', balance: 590000, income: 0, expense: 30000 },
  { date: '2026-03-10', label: '10 Mars', balance: 640000, income: 55000, expense: 5000 },
  { date: '2026-03-13', label: '13 Mars', balance: 615000, income: 0, expense: 25000 },
  { date: '2026-03-15', label: '15 Mars', balance: 590000, income: 0, expense: 25000 },
  { date: '2026-03-18', label: '18 Mars', balance: 610000, income: 45000, expense: 25000 },
  { date: '2026-03-20', label: '20 Mars', balance: 680000, income: 80000, expense: 10000 },
  { date: '2026-03-23', label: '23 Mars', balance: 665000, income: 0, expense: 15000 },
  { date: '2026-03-25', label: '25 Mars', balance: 720000, income: 65000, expense: 10000 },
  { date: '2026-03-28', label: '28 Mars', balance: 810000, income: 350000, expense: 260000 },
  { date: '2026-03-30', label: '30 Mars', balance: 802000, income: 0, expense: 8000 },
]

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  { id: 'ai1', type: 'positive', title: 'Bonne nouvelle !', message: 'Ton solde est en hausse de 12,5% sur les 30 derniers jours. Continue comme ça !', icon: '📈' },
  { id: 'ai2', type: 'warning', title: 'Attention', message: 'Tes dépenses en Alimentation représentent 28% de tes dépenses totales. C\'est au-dessus de la moyenne.', icon: '⚠️' },
  { id: 'ai3', type: 'tip', title: 'Conseil', message: 'En épargnant 25 000 FCFA par semaine, tu atteindras ton objectif "Nouvel ordinateur" en 6 semaines.', icon: '💡' },
]
