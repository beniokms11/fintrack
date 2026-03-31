// ============================================
// FinTrack Type Definitions
// ============================================

export type TransactionType = 'income' | 'expense'

export type WalletType = 'cash' | 'mtn_momo' | 'moov_money' | 'bank' | 'savings'

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly'

export type ChartPeriod = '7d' | '30d' | '3m' | '12m'

export type ChartMode = 'balance' | 'income_vs_expense'

// --- Core Models ---

export interface Profile {
  id: string
  user_id: string
  full_name: string
  currency: string
  language: string
  theme: 'light' | 'dark'
  created_at: string
  updated_at: string
}

export interface Wallet {
  id: string
  user_id: string
  name: string
  type: WalletType
  balance: number
  icon: string
  color: string
  is_default: boolean
  created_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  icon: string
  color: string
  type: TransactionType | 'both'
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  wallet_id: string
  type: TransactionType
  amount: number
  category_id: string
  description: string
  merchant: string | null
  date: string
  created_at: string
  updated_at: string
  // Joined
  category?: Category
  wallet?: Wallet
}

export interface Budget {
  id: string
  user_id: string
  category_id: string
  amount: number
  period: BudgetPeriod
  created_at: string
  // Computed
  spent?: number
  remaining?: number
  percentage?: number
  category?: Category
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  icon: string
  color: string
  created_at: string
  updated_at: string
}

export interface AIConversation {
  id: string
  user_id: string
  messages: AIMessage[]
  created_at: string
  updated_at: string
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

// --- Dashboard Types ---

export interface DashboardStats {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  balanceChange: number // percentage change
}

export interface ChartDataPoint {
  date: string
  label: string
  balance?: number
  income?: number
  expense?: number
}

export interface SpendingByCategory {
  category: Category
  total: number
  percentage: number
  count: number
}

export interface AIInsight {
  id: string
  type: 'positive' | 'warning' | 'neutral' | 'tip'
  title: string
  message: string
  icon: string
}

// --- Form Types ---

export interface TransactionFormData {
  type: TransactionType
  amount: string
  category_id: string
  wallet_id: string
  date: string
  description: string
  merchant: string
}

export interface BudgetFormData {
  category_id: string
  amount: string
  period: BudgetPeriod
}

export interface SavingsGoalFormData {
  name: string
  target_amount: string
  deadline: string
  icon: string
  color: string
}

// --- Motivational Quotes ---

export interface Quote {
  text: string
  author: string
}
