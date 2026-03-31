'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction, Wallet, DashboardStats, Budget, SavingsGoal, SpendingByCategory, ChartDataPoint, AIInsight, Category } from '@/lib/types'
import { MOCK_CATEGORIES } from '@/lib/mock-data'

interface AppState {
  transactions: Transaction[]
  wallets: Wallet[]
  categories: Category[]
  stats: DashboardStats
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
  topSpending: SpendingByCategory[]
  chartData: ChartDataPoint[]
  aiInsights: AIInsight[]
  loading: boolean
  addTransaction: (data: {
    type: 'income' | 'expense'
    amount: number
    category_id: string
    wallet_id: string
    date: string
    description: string
    merchant: string
  }) => Promise<void>
  addBudget: (data: {
    category_id: string
    amount: number
    period: string
  }) => Promise<void>
  addSavingsGoal: (data: {
    name: string
    target_amount: number
    deadline: string | null
    icon: string
    color: string
  }) => Promise<void>
  updateSavingsGoalAmount: (goalId: string, additionalAmount: number) => Promise<void>
  addWallet: (data: {
    name: string
    type: string
    balance: number
    icon: string
    color: string
  }) => Promise<void>
  updateProfile: (data: {
    full_name?: string
  }) => Promise<void>
  setGlobalAddModalOpen: (open: boolean) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [loading, setLoading] = useState(true)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [isGlobalAddModalOpen, setGlobalAddModalOpen] = useState(false)

  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    balanceChange: 0,
  })
  const [topSpending, setTopSpending] = useState<SpendingByCategory[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    // Fetch all required data in parallel
    const [
      { data: fetchedWallets },
      { data: fetchedCategories },
      { data: fetchedTransactions },
      { data: fetchedBudgets },
      { data: fetchedSavings },
    ] = await Promise.all([
      supabase.from('wallets').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('transactions').select('*, category:categories(*), wallet:wallets(*)').order('date', { ascending: false }),
      supabase.from('budgets').select('*, category:categories(*)'),
      supabase.from('savings_goals').select('*'),
    ])

    // Initial setup if empty
    let wData = fetchedWallets || []
    let cData = fetchedCategories || []

    if (wData.length === 0) {
      // Create default wallet
      const { data: newWallet } = await supabase.from('wallets').insert({
        user_id: user.id,
        name: 'Espèces',
        type: 'cash',
        balance: 0,
        icon: '💵',
        color: '#10B981',
      }).select().single()
      if (newWallet) wData = [newWallet]
    }

    if (cData.length === 0) {
      // Create default categories for the user
      const defaultCategories = MOCK_CATEGORIES.map(c => ({
        user_id: user.id,
        name: c.name,
        type: c.type,
        icon: c.icon,
        color: c.color,
        is_default: true
      }))
      const { data: newCats } = await supabase.from('categories').insert(defaultCategories).select()
      if (newCats) cData = newCats
    }

    const txData = fetchedTransactions || []
    const bData = fetchedBudgets || []
    const sgData = fetchedSavings || []

    setWallets(wData)
    setCategories(cData)
    setTransactions(txData)
    setSavingsGoals(sgData)

    // Calculate stats
    let balance = 0
    let income = 0
    let expense = 0
    
    // Quick calculate from wallets for balance
    balance = wData.reduce((acc: number, w: any) => acc + Number(w.balance), 0)

    // Calculate 30-day stats
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    txData.forEach((tx: any) => {
      const txDate = new Date(tx.date)
      if (txDate >= thirtyDaysAgo) {
        if (tx.type === 'income') income += Number(tx.amount)
        if (tx.type === 'expense') expense += Number(tx.amount)
      }
    })

    const savings = sgData.reduce((acc: number, sg: any) => acc + Number(sg.current_amount), 0)

    setStats({
      totalBalance: balance,
      totalIncome: income,
      totalExpenses: expense,
      totalSavings: savings,
      balanceChange: 0, // Simplified for now
    })

    // Calculate Top Spending
    const spendingMap: Record<string, { category: any, total: number, count: number }> = {}
    txData.forEach((tx: any) => {
      if (tx.type === 'expense' && tx.category) {
        if (!spendingMap[tx.category.id]) {
          spendingMap[tx.category.id] = {
            category: tx.category,
            total: 0,
            count: 0
          }
        }
        spendingMap[tx.category.id].total += Number(tx.amount)
        spendingMap[tx.category.id].count += 1
      }
    })

    const top = Object.values(spendingMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 4)
      .map(s => ({
        category: s.category,
        total: s.total,
        count: s.count,
        percentage: expense > 0 ? s.total / expense : 0
      }))
    setTopSpending(top)

    // Calculate Budgets Progress
    const processedBudgets = bData.map((b: any) => {
      const budgetAmount = Number(b.amount || 0)
      const spent = txData
        .filter((tx: any) => tx.type === 'expense' && tx.category_id === b.category_id)
        .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0)
      
      return {
        ...b,
        amount: budgetAmount,
        spent,
        remaining: budgetAmount - spent,
        percentage: budgetAmount > 0 ? spent / budgetAmount : 0
      }
    })
    setBudgets(processedBudgets)

    // Calculate Chart Data (last 7 days for simplicity)
    const cwData = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' })
      
      let dayInc = 0
      let dayExp = 0
      
      txData.forEach((tx: any) => {
        if (tx.date === dateStr) {
          if (tx.type === 'income') dayInc += Number(tx.amount)
          if (tx.type === 'expense') dayExp += Number(tx.amount)
        }
      })
      
      cwData.push({
        date: dateStr,
        label: dayName,
        balance: balance, // simplified
        income: dayInc,
        expense: dayExp
      })
    }
    setChartData(cwData)

    // Fetch AI Insights if there are transactions
    if (txData.length > 0) {
      try {
        const response = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactions: txData, period: '30 derniers jours' }),
        })
        if (response.ok) {
          const { insights } = await response.json()
          if (insights && Array.isArray(insights)) {
            setAiInsights(insights)
          }
        }
      } catch (err) {
        console.error('Failed to fetch AI insights:', err)
      }
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addTransaction = useCallback(async (data: {
    type: 'income' | 'expense'
    amount: number
    category_id: string
    wallet_id: string
    date: string
    description: string
    merchant: string
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Insert transaction
    const { data: newTx, error: txError } = await supabase.from('transactions').insert({
      user_id: user.id,
      ...data
    }).select('*, category:categories(*), wallet:wallets(*)').single()

    if (txError) {
      console.error(txError)
      return
    }

    // 2. Fetch current wallet balance to update it correctly
    const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', data.wallet_id).single()
    
    if (wallet) {
      const newBalance = data.type === 'income' 
        ? Number(wallet.balance) + data.amount 
        : Number(wallet.balance) - data.amount

      await supabase.from('wallets').update({ balance: newBalance }).eq('id', data.wallet_id)
    }

    // Refresh state from DB to keep everything perfectly in sync
    await fetchData()
  }, [supabase, fetchData])

  const addBudget = useCallback(async (data: {
    category_id: string
    amount: number
    period: string
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('budgets').insert({
      user_id: user.id,
      ...data
    })

    if (error) {
      console.error(error)
      return
    }

    await fetchData()
  }, [supabase, fetchData])

  const addSavingsGoal = useCallback(async (data: {
    name: string
    target_amount: number
    deadline: string | null
    icon: string
    color: string
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('savings_goals').insert({
      user_id: user.id,
      ...data,
      current_amount: 0
    })

    if (error) {
      console.error(error)
      return
    }

    await fetchData()
  }, [supabase, fetchData])

  const addWallet = useCallback(async (data: {
    name: string
    type: string
    balance: number
    icon: string
    color: string
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('wallets').insert({
      user_id: user.id,
      ...data
    })

    if (error) {
      console.error(error)
      return
    }

    await fetchData()
  }, [supabase, fetchData])

  const updateProfile = useCallback(async (data: {
    full_name?: string
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('profiles').update(data).eq('id', user.id)

    if (error) {
      console.error(error)
      return
    }

    await fetchData()
  }, [supabase, fetchData])

  return (
    <AppContext.Provider value={{
      transactions,
      wallets,
      categories,
      stats,
      budgets,
      savingsGoals,
      topSpending,
      chartData,
      aiInsights,
      loading,
      addTransaction,
      addBudget,
      addSavingsGoal,
      updateSavingsGoalAmount,
      addWallet,
      updateProfile,
      setGlobalAddModalOpen,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
