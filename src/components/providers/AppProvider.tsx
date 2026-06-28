'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Transaction, Wallet, DashboardStats, Budget, SavingsGoal, 
  SpendingByCategory, AIInsight, Category, Profile, 
  Tontine, TontineMember, TontinePayment, RecurringTransaction 
} from '@/lib/types'
import { MOCK_CATEGORIES } from '@/lib/mock-data'

interface AppState {
  profile: Profile | null
  transactions: Transaction[]
  wallets: Wallet[]
  categories: Category[]
  stats: DashboardStats
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
  tontines: Tontine[]
  recurringTransactions: RecurringTransaction[]
  topSpending: SpendingByCategory[]
  aiInsights: AIInsight[]
  loading: boolean
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  
  // Transaction actions
  addTransaction: (data: {
    type: 'income' | 'expense'
    amount: number
    category_id: string
    wallet_id: string
    date: string
    description: string
    merchant: string
  }) => Promise<void>
  updateTransaction: (id: string, data: any) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  // Wallet actions
  addWallet: (data: {
    name: string
    type: string
    balance: number
    icon: string
    color: string
  }) => Promise<void>
  updateWallet: (id: string, data: any) => Promise<void>
  deleteWallet: (id: string) => Promise<void>

  // Budget actions
  addBudget: (data: {
    category_id: string
    amount: number
    period: string
    month?: string
  }) => Promise<void>
  updateBudget: (id: string, data: any) => Promise<void>
  deleteBudget: (id: string) => Promise<void>

  // Category actions
  addCategory: (data: {
    name: string
    type: 'income' | 'expense' | 'both'
    icon: string
    color: string
  }) => Promise<Category | null>
  updateCategory: (id: string, data: any) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  // Savings goals actions
  addSavingsGoal: (data: {
    name: string
    target_amount: number
    deadline: string | null
    icon: string
    color: string
  }) => Promise<void>
  updateSavingsGoalAmount: (goalId: string, additionalAmount: number) => Promise<void>

  // Profile actions
  updateProfile: (data: {
    full_name?: string
    currency?: string
    theme?: 'light' | 'dark'
  }) => Promise<void>

  // Tontine actions
  addTontine: (data: {
    name: string
    contribution_amount: number
    frequency: 'weekly' | 'monthly'
    start_date: string
    members: { name: string; draw_turn: number }[]
  }) => Promise<void>
  payTontineRound: (tontineId: string, memberId: string, roundNumber: number, amount: number) => Promise<void>
  payoutTontine: (tontineId: string, memberId: string, payoutDate: string) => Promise<void>
  deleteTontine: (tontineId: string) => Promise<void>

  // Recurring transactions actions
  addRecurringTransaction: (data: {
    wallet_id: string
    category_id: string
    type: 'income' | 'expense'
    amount: number
    description: string
    merchant: string
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    start_date: string
  }) => Promise<void>
  deleteRecurringTransaction: (id: string) => Promise<void>
  toggleRecurringTransaction: (id: string, active: boolean) => Promise<void>

  setGlobalAddModalOpen: (open: boolean) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [loading, setLoading] = useState(true)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [rawBudgets, setRawBudgets] = useState<Budget[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [tontines, setTontines] = useState<Tontine[]>([])
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
  const [isGlobalAddModalOpen, setGlobalAddModalOpen] = useState(false)

  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    balanceChange: 0,
  })
  const [topSpending, setTopSpending] = useState<SpendingByCategory[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])

  // Recalcule dynamiquement stats, topSpending et budgets en fonction du mois sélectionné
  useEffect(() => {
    if (loading && transactions.length === 0 && wallets.length === 0) return

    const monthTx = transactions.filter(tx => tx.date && tx.date.startsWith(selectedMonth))

    // 1. Stats du mois
    const balance = wallets.reduce((acc, w) => acc + Number(w.balance), 0)
    let income = 0
    let expense = 0
    monthTx.forEach(tx => {
      if (tx.type === 'income') income += Number(tx.amount)
      if (tx.type === 'expense') expense += Number(tx.amount)
    })
    const savings = savingsGoals.reduce((acc, sg) => acc + Number(sg.current_amount), 0)

    setStats({
      totalBalance: balance,
      totalIncome: income,
      totalExpenses: expense,
      totalSavings: savings,
      balanceChange: 0
    })

    // 2. Répartition des dépenses du mois (Top Spending)
    const spendingMap: Record<string, { category: Category, total: number, count: number }> = {}
    monthTx.forEach(tx => {
      if (tx.type === 'expense' && tx.category) {
        if (!spendingMap[tx.category.id]) {
          spendingMap[tx.category.id] = { category: tx.category, total: 0, count: 0 }
        }
        spendingMap[tx.category.id].total += Number(tx.amount)
        spendingMap[tx.category.id].count += 1
      }
    })

    const top = Object.values(spendingMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map(s => ({
        category: s.category,
        total: s.total,
        count: s.count,
        percentage: expense > 0 ? s.total / expense : 0
      }))
    setTopSpending(top)

    // 3. Budgets filtrés et calculés pour le mois
    const processedBudgets = rawBudgets
      .filter(b => !b.month || b.month === 'all' || b.month === selectedMonth)
      .map(b => {
        const budgetAmount = Number(b.amount || 0)
        const spent = monthTx
          .filter(tx => tx.type === 'expense' && tx.category_id === b.category_id)
          .reduce((sum, tx) => sum + Number(tx.amount), 0)
        
        return {
          ...b,
          amount: budgetAmount,
          spent,
          remaining: budgetAmount - spent,
          percentage: budgetAmount > 0 ? spent / budgetAmount : 0,
          category: categories.find(c => c.id === b.category_id) || b.category
        }
      })
    setBudgets(processedBudgets)
  }, [transactions, wallets, rawBudgets, savingsGoals, categories, selectedMonth, loading])

  // Helper check for fallback mode
  const isFallbackMode = useCallback(() => {
    if (typeof window !== 'undefined' && document.cookie.includes('fintrack_mode=offline')) {
      return true
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    return !url || url.includes('placeholder')
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)

    if (isFallbackMode()) {
      // Offline / LocalStorage Mode
      const localProfile = localStorage.getItem('fintrack_profile')
      const localWallets = localStorage.getItem('fintrack_wallets')
      const localCategories = localStorage.getItem('fintrack_categories')
      const localTransactions = localStorage.getItem('fintrack_transactions')
      const localBudgets = localStorage.getItem('fintrack_budgets')
      const localSavings = localStorage.getItem('fintrack_savings')
      const localTontines = localStorage.getItem('fintrack_tontines')
      const localRecurring = localStorage.getItem('fintrack_recurring')

      const pData = localProfile ? JSON.parse(localProfile) : { 
        id: 'local-user', 
        full_name: 'Utilisateur Local', 
        currency: 'XOF', 
        theme: 'light' 
      }
      let wData = localWallets ? JSON.parse(localWallets) : []
      let cData = localCategories ? JSON.parse(localCategories) : []
      let txData = localTransactions ? JSON.parse(localTransactions) : []
      const bData = localBudgets ? JSON.parse(localBudgets) : []
      const sgData = localSavings ? JSON.parse(localSavings) : []
      let tonData = localTontines ? JSON.parse(localTontines) : []
      let recData = localRecurring ? JSON.parse(localRecurring) : []

      if (wData.length === 0) {
        wData = [{
          id: 'w-default',
          user_id: 'local-user',
          name: 'Espèces',
          type: 'cash',
          balance: 75000, // starting funds
          icon: '💵',
          color: '#10B981',
          is_default: true,
          created_at: new Date().toISOString()
        }]
        localStorage.setItem('fintrack_wallets', JSON.stringify(wData))
      }

      if (cData.length === 0) {
        cData = MOCK_CATEGORIES.map((c, i) => ({
          id: `c-${i}`,
          user_id: 'local-user',
          name: c.name,
          type: c.type,
          icon: c.icon,
          color: c.color,
          is_default: true,
          created_at: new Date().toISOString()
        }))
        localStorage.setItem('fintrack_categories', JSON.stringify(cData))
      }

      // --- Process Local Recurring Transactions ---
      const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
      let generatedAny = false

      const updatedRecData = recData.map((rec: RecurringTransaction) => {
        if (!rec.is_active) return rec

        let nextDate = rec.last_generated || rec.start_date
        let datesToGenerate: string[] = []

        while (true) {
          let d = new Date(nextDate)
          if (rec.frequency === 'daily') d.setDate(d.getDate() + 1)
          else if (rec.frequency === 'weekly') d.setDate(d.getDate() + 7)
          else if (rec.frequency === 'monthly') d.setMonth(d.getMonth() + 1)
          else if (rec.frequency === 'yearly') d.setFullYear(d.getFullYear() + 1)

          const dStr = d.toISOString().slice(0, 10)
          if (dStr <= todayStr) {
            datesToGenerate.push(dStr)
            nextDate = dStr
          } else {
            break
          }
        }

        if (datesToGenerate.length > 0) {
          generatedAny = true
          datesToGenerate.forEach(genDate => {
            // 1. Generate transaction
            const generatedTx: Transaction = {
              id: `tx-rec-${Math.random().toString(36).substr(2, 9)}`,
              user_id: 'local-user',
              type: rec.type,
              amount: rec.amount,
              category_id: rec.category_id,
              wallet_id: rec.wallet_id,
              date: genDate,
              description: `${rec.description} (Récurrent)`,
              merchant: rec.merchant,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            txData.unshift(generatedTx)

            // 2. Adjust wallet balance
            wData = wData.map((w: Wallet) => {
              if (w.id === rec.wallet_id) {
                const change = Number(rec.amount)
                const nextBal = rec.type === 'income' ? Number(w.balance) + change : Number(w.balance) - change
                return { ...w, balance: nextBal }
              }
              return w
            })
          })
          return { ...rec, last_generated: nextDate }
        }

        return rec
      })

      if (generatedAny) {
        recData = updatedRecData
        localStorage.setItem('fintrack_transactions', JSON.stringify(txData))
        localStorage.setItem('fintrack_wallets', JSON.stringify(wData))
        localStorage.setItem('fintrack_recurring', JSON.stringify(recData))
      }

      // Attach joins dynamically for rendering
      const richTransactions = txData.map((tx: any) => ({
        ...tx,
        category: cData.find((c: any) => c.id === tx.category_id),
        wallet: wData.find((w: any) => w.id === tx.wallet_id)
      }))

      setProfile(pData)
      setWallets(wData)
      setCategories(cData)
      setTransactions(richTransactions)
      setSavingsGoals(sgData)
      setTontines(tonData)
      setRecurringTransactions(recData)

      // Compute statistics
      const balance = wData.reduce((acc: number, w: Wallet) => acc + Number(w.balance), 0)
      let income = 0
      let expense = 0
      
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysAgoStr = new Date(thirtyDaysAgo.getTime() - thirtyDaysAgo.getTimezoneOffset() * 60000).toISOString().slice(0, 10)

      richTransactions.forEach((tx: Transaction) => {
        if (tx.date >= thirtyDaysAgoStr) {
          if (tx.type === 'income') income += Number(tx.amount)
          if (tx.type === 'expense') expense += Number(tx.amount)
        }
      })

      const savings = sgData.reduce((acc: number, sg: SavingsGoal) => acc + Number(sg.current_amount), 0)

      setStats({
        totalBalance: balance,
        totalIncome: income,
        totalExpenses: expense,
        totalSavings: savings,
        balanceChange: 0
      })

      // Top Spending
      const spendingMap: Record<string, { category: Category, total: number, count: number }> = {}
      richTransactions.forEach((tx: Transaction) => {
        if (tx.type === 'expense' && tx.category) {
          if (!spendingMap[tx.category.id]) {
            spendingMap[tx.category.id] = { category: tx.category, total: 0, count: 0 }
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

      setRawBudgets(bData)
      setLoading(false)
      return
    }

    // Supabase Mode
    try {
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
        { data: fetchedProfile },
        { data: fetchedTontines },
        { data: fetchedRecurring }
      ] = await Promise.all([
        supabase.from('wallets').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('transactions').select('*, category:categories(*), wallet:wallets(*)').order('date', { ascending: false }),
        supabase.from('budgets').select('*, category:categories(*)'),
        supabase.from('savings_goals').select('*'),
        supabase.from('profiles').select('*').maybeSingle(),
        supabase.from('tontines').select('*, members:tontine_members(*, payments:tontine_payments(*))'),
        supabase.from('recurring_transactions').select('*')
      ])

      let wData = fetchedWallets || []
      let cData = fetchedCategories || []
      let txData = fetchedTransactions || []
      let tonData = fetchedTontines || []
      let recData = fetchedRecurring || []

      // Setup default cash wallet if none
      if (wData.length === 0) {
        const { data: newWallet } = await supabase.from('wallets').insert({
          user_id: user.id,
          name: 'Espèces',
          type: 'cash',
          balance: 75000,
          icon: '💵',
          color: '#10B981'
        }).select().single()
        if (newWallet) wData = [newWallet]
      }

      // Setup default categories if none
      if (cData.length === 0) {
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

      // --- Process Cloud Recurring Transactions ---
      const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
      let generatedAny = false

      for (const rec of recData) {
        if (!rec.is_active) continue

        let nextDate = rec.last_generated || rec.start_date
        let datesToGenerate: string[] = []

        while (true) {
          let d = new Date(nextDate)
          if (rec.frequency === 'daily') d.setDate(d.getDate() + 1)
          else if (rec.frequency === 'weekly') d.setDate(d.getDate() + 7)
          else if (rec.frequency === 'monthly') d.setMonth(d.getMonth() + 1)
          else if (rec.frequency === 'yearly') d.setFullYear(d.getFullYear() + 1)

          const dStr = d.toISOString().slice(0, 10)
          if (dStr <= todayStr) {
            datesToGenerate.push(dStr)
            nextDate = dStr
          } else {
            break
          }
        }

        if (datesToGenerate.length > 0) {
          generatedAny = true
          for (const genDate of datesToGenerate) {
            await supabase.from('transactions').insert({
              user_id: user.id,
              type: rec.type,
              amount: rec.amount,
              category_id: rec.category_id,
              wallet_id: rec.wallet_id,
              date: genDate,
              description: `${rec.description} (Récurrent)`,
              merchant: rec.merchant,
              is_recurring: true,
              recurring_id: rec.id
            })

            const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', rec.wallet_id).single()
            if (wallet) {
              const change = Number(rec.amount)
              const nextBal = rec.type === 'income' ? Number(wallet.balance) + change : Number(wallet.balance) - change
              await supabase.from('wallets').update({ balance: nextBal }).eq('id', rec.wallet_id)
            }
          }
          await supabase.from('recurring_transactions').update({ last_generated: nextDate }).eq('id', rec.id)
        }
      }

      if (generatedAny) {
        // reload values
        const { data: reloadTx } = await supabase.from('transactions').select('*, category:categories(*), wallet:wallets(*)').order('date', { ascending: false })
        const { data: reloadW } = await supabase.from('wallets').select('*')
        const { data: reloadR } = await supabase.from('recurring_transactions').select('*')
        txData = reloadTx || []
        wData = reloadW || []
        recData = reloadR || []
      }

      setWallets(wData)
      setCategories(cData)
      setTransactions(txData)
      let effectiveProfile = fetchedProfile
      if (!effectiveProfile || !effectiveProfile.full_name) {
        const fallbackName = user.user_metadata?.full_name || user.user_metadata?.name || (user.email ? user.email.split('@')[0].replace(/[\._-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Utilisateur')
        if (!effectiveProfile) {
          effectiveProfile = {
            id: user.id,
            full_name: fallbackName,
            currency: 'XOF',
            theme: 'light'
          }
          await supabase.from('profiles').upsert(effectiveProfile)
        } else {
          effectiveProfile.full_name = fallbackName
          await supabase.from('profiles').update({ full_name: fallbackName }).eq('id', user.id)
        }
      }
      setProfile(effectiveProfile)
      setTontines(tonData)
      setRecurringTransactions(recData)

      // Calculate stats
      const balance = wData.reduce((acc: number, w: Wallet) => acc + Number(w.balance), 0)
      let income = 0
      let expense = 0
      
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysAgoStr = new Date(thirtyDaysAgo.getTime() - thirtyDaysAgo.getTimezoneOffset() * 60000).toISOString().slice(0, 10)

      txData.forEach((tx: any) => {
        if (tx.date >= thirtyDaysAgoStr) {
          if (tx.type === 'income') income += Number(tx.amount)
          if (tx.type === 'expense') expense += Number(tx.amount)
        }
      })

      const savings = (fetchedSavings || []).reduce((acc: number, sg: SavingsGoal) => acc + Number(sg.current_amount), 0)

      setStats({
        totalBalance: balance,
        totalIncome: income,
        totalExpenses: expense,
        totalSavings: savings,
        balanceChange: 0
      })

      // Top Spending
      const spendingMap: Record<string, { category: Category, total: number, count: number }> = {}
      txData.forEach((tx: any) => {
        if (tx.type === 'expense' && tx.category) {
          if (!spendingMap[tx.category.id]) {
            spendingMap[tx.category.id] = { category: tx.category, total: 0, count: 0 }
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

      setRawBudgets(fetchedBudgets || [])

      // Fetch AI Insights
      if (txData.length > 0) {
        try {
          const response = await fetch('/api/ai/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactions: txData, period: '30 derniers jours' }),
          })
          if (response.ok) {
            const { insights } = await response.json()
            if (insights && Array.isArray(insights)) setAiInsights(insights)
          }
        } catch (err) {
          console.error('Failed to fetch AI insights:', err)
        }
      }
    } catch (err) {
      console.error("Supabase load failed: ", err)
    } finally {
      setLoading(false)
    }
  }, [supabase, isFallbackMode])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- CRUD WRAPPERS ---

  // Transactions CRUD
  const addTransaction = useCallback(async (data: {
    type: 'income' | 'expense'
    amount: number
    category_id: string
    wallet_id: string
    date: string
    description: string
    merchant: string
  }) => {
    if (isFallbackMode()) {
      const localTxs = JSON.parse(localStorage.getItem('fintrack_transactions') || '[]')
      const newTx = {
        id: `tx-${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'local-user',
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      localTxs.unshift(newTx)
      localStorage.setItem('fintrack_transactions', JSON.stringify(localTxs))

      const localWallets = JSON.parse(localStorage.getItem('fintrack_wallets') || '[]')
      const updatedWallets = localWallets.map((w: Wallet) => {
        if (w.id === data.wallet_id) {
          const change = Number(data.amount)
          return {
            ...w,
            balance: data.type === 'income' ? Number(w.balance) + change : Number(w.balance) - change
          }
        }
        return w
      })
      localStorage.setItem('fintrack_wallets', JSON.stringify(updatedWallets))

      await fetchData()
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: txError } = await supabase.from('transactions').insert({
      user_id: user.id,
      ...data
    })

    if (txError) {
      window.alert("Erreur transaction : " + txError.message)
      return
    }

    const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', data.wallet_id).single()
    if (wallet) {
      const change = Number(data.amount)
      const nextBal = data.type === 'income' ? Number(wallet.balance) + change : Number(wallet.balance) - change
      await supabase.from('wallets').update({ balance: nextBal }).eq('id', data.wallet_id)
    }

    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const updateTransaction = useCallback(async (id: string, data: any) => {
    if (isFallbackMode()) {
      const localTxs = JSON.parse(localStorage.getItem('fintrack_transactions') || '[]')
      const updated = localTxs.map((tx: any) => tx.id === id ? { ...tx, ...data, updated_at: new Date().toISOString() } : tx)
      localStorage.setItem('fintrack_transactions', JSON.stringify(updated))
      await fetchData()
      return
    }
    await supabase.from('transactions').update(data).eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const deleteTransaction = useCallback(async (id: string) => {
    if (isFallbackMode()) {
      const localTxs = JSON.parse(localStorage.getItem('fintrack_transactions') || '[]')
      const target = localTxs.find((tx: any) => tx.id === id)
      
      if (target) {
        // Reverse balance update on delete
        const localWallets = JSON.parse(localStorage.getItem('fintrack_wallets') || '[]')
        const updatedWallets = localWallets.map((w: Wallet) => {
          if (w.id === target.wallet_id) {
            const change = Number(target.amount)
            return {
              ...w,
              balance: target.type === 'income' ? Number(w.balance) - change : Number(w.balance) + change
            }
          }
          return w
        })
        localStorage.setItem('fintrack_wallets', JSON.stringify(updatedWallets))
      }

      const filtered = localTxs.filter((tx: any) => tx.id !== id)
      localStorage.setItem('fintrack_transactions', JSON.stringify(filtered))
      await fetchData()
      return
    }
    await supabase.from('transactions').delete().eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  // Wallets CRUD
  const addWallet = useCallback(async (data: {
    name: string
    type: string
    balance: number
    icon: string
    color: string
  }) => {
    if (isFallbackMode()) {
      const localWallets = JSON.parse(localStorage.getItem('fintrack_wallets') || '[]')
      localWallets.push({
        id: `w-${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'local-user',
        ...data,
        is_default: false,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('fintrack_wallets', JSON.stringify(localWallets))
      await fetchData()
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('wallets').insert({
      user_id: user.id,
      ...data
    })
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const updateWallet = useCallback(async (id: string, data: any) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_wallets') || '[]')
      const updated = local.map((w: any) => w.id === id ? { ...w, ...data } : w)
      localStorage.setItem('fintrack_wallets', JSON.stringify(updated))
      await fetchData()
      return
    }
    await supabase.from('wallets').update(data).eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const deleteWallet = useCallback(async (id: string) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_wallets') || '[]')
      const filtered = local.filter((w: any) => w.id !== id)
      localStorage.setItem('fintrack_wallets', JSON.stringify(filtered))
      await fetchData()
      return
    }
    await supabase.from('wallets').delete().eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  // Budgets CRUD
  const addBudget = useCallback(async (data: {
    category_id: string
    amount: number
    period: string
    month?: string
  }) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]')
      local.push({
        id: `b-${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'local-user',
        ...data,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('fintrack_budgets', JSON.stringify(local))
      await fetchData()
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('budgets').insert({
      user_id: user.id,
      ...data
    })
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const updateBudget = useCallback(async (id: string, data: any) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]')
      const updated = local.map((b: any) => b.id === id ? { ...b, ...data } : b)
      localStorage.setItem('fintrack_budgets', JSON.stringify(updated))
      await fetchData()
      return
    }
    await supabase.from('budgets').update(data).eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const deleteBudget = useCallback(async (id: string) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]')
      const filtered = local.filter((b: any) => b.id !== id)
      localStorage.setItem('fintrack_budgets', JSON.stringify(filtered))
      await fetchData()
      return
    }
    await supabase.from('budgets').delete().eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  // Categories CRUD
  const addCategory = useCallback(async (data: {
    name: string
    type: 'income' | 'expense' | 'both'
    icon: string
    color: string
  }) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_categories') || '[]')
      const newCat = {
        id: `c-${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'local-user',
        ...data,
        is_default: false,
        created_at: new Date().toISOString()
      }
      local.push(newCat)
      localStorage.setItem('fintrack_categories', JSON.stringify(local))
      await fetchData()
      return newCat
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: newCat, error } = await supabase.from('categories').insert({
      user_id: user.id,
      ...data,
      is_default: false
    }).select().single()

    if (error) return null
    await fetchData()
    return newCat
  }, [supabase, isFallbackMode, fetchData])

  const updateCategory = useCallback(async (id: string, data: any) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_categories') || '[]')
      const updated = local.map((c: any) => c.id === id ? { ...c, ...data } : c)
      localStorage.setItem('fintrack_categories', JSON.stringify(updated))
      await fetchData()
      return
    }
    await supabase.from('categories').update(data).eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const deleteCategory = useCallback(async (id: string) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_categories') || '[]')
      const filtered = local.filter((c: any) => c.id !== id)
      localStorage.setItem('fintrack_categories', JSON.stringify(filtered))
      await fetchData()
      return
    }
    await supabase.from('categories').delete().eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  // Savings goals CRUD
  const addSavingsGoal = useCallback(async (data: {
    name: string
    target_amount: number
    deadline: string | null
    icon: string
    color: string
  }) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_savings') || '[]')
      local.push({
        id: `sg-${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'local-user',
        ...data,
        current_amount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      localStorage.setItem('fintrack_savings', JSON.stringify(local))
      await fetchData()
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('savings_goals').insert({
      user_id: user.id,
      ...data,
      current_amount: 0
    })
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const updateSavingsGoalAmount = useCallback(async (goalId: string, additionalAmount: number) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_savings') || '[]')
      const updated = local.map((sg: SavingsGoal) => {
        if (sg.id === goalId) {
          return {
            ...sg,
            current_amount: Number(sg.current_amount || 0) + additionalAmount,
            updated_at: new Date().toISOString()
          }
        }
        return sg
      })
      localStorage.setItem('fintrack_savings', JSON.stringify(updated))
      await fetchData()
      return
    }

    const { data: goal } = await supabase.from('savings_goals').select('current_amount').eq('id', goalId).single()
    if (!goal) return

    const nextAmt = Number(goal.current_amount) + additionalAmount
    await supabase.from('savings_goals').update({ current_amount: nextAmt }).eq('id', goalId)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  // Profile actions
  const updateProfile = useCallback(async (data: {
    full_name?: string
    currency?: string
    theme?: 'light' | 'dark'
  }) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_profile') || '{}')
      const next = { ...local, ...data, updated_at: new Date().toISOString() }
      localStorage.setItem('fintrack_profile', JSON.stringify(next))
      setProfile(next)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').upsert({ id: user.id, ...data })
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  // --- TONTINES CRUD ---
  const addTontine = useCallback(async (data: {
    name: string
    contribution_amount: number
    frequency: 'weekly' | 'monthly'
    start_date: string
    members: { name: string; draw_turn: number }[]
  }) => {
    if (isFallbackMode()) {
      const localTontines = JSON.parse(localStorage.getItem('fintrack_tontines') || '[]')
      const tontineId = `tontine-${Math.random().toString(36).substr(2, 9)}`
      
      const newTontine: Tontine = {
        id: tontineId,
        user_id: 'local-user',
        name: data.name,
        contribution_amount: data.contribution_amount,
        frequency: data.frequency,
        start_date: data.start_date,
        status: 'active',
        created_at: new Date().toISOString(),
        members: data.members.map((m, index) => ({
          id: `member-${tontineId}-${index}`,
          tontine_id: tontineId,
          name: m.name,
          draw_turn: m.draw_turn,
          payout_date: null,
          is_paid_out: false,
          created_at: new Date().toISOString(),
          payments: []
        }))
      }

      localTontines.push(newTontine)
      localStorage.setItem('fintrack_tontines', JSON.stringify(localTontines))
      await fetchData()
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: newT, error: tError } = await supabase.from('tontines').insert({
      user_id: user.id,
      name: data.name,
      contribution_amount: data.contribution_amount,
      frequency: data.frequency,
      start_date: data.start_date
    }).select().single()

    if (tError || !newT) return

    const membersPayload = data.members.map(m => ({
      tontine_id: newT.id,
      name: m.name,
      draw_turn: m.draw_turn
    }))

    await supabase.from('tontine_members').insert(membersPayload)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const payTontineRound = useCallback(async (tontineId: string, memberId: string, roundNumber: number, amount: number) => {
    const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)

    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_tontines') || '[]')
      const updated = local.map((t: Tontine) => {
        if (t.id === tontineId && t.members) {
          const updatedMembers = t.members.map((m: TontineMember) => {
            if (m.id === memberId) {
              const payments = m.payments || []
              // check if already paid
              if (payments.some(p => p.round_number === roundNumber)) return m
              
              const newPayment: TontinePayment = {
                id: `payment-${Math.random().toString(36).substr(2, 9)}`,
                tontine_id: tontineId,
                member_id: memberId,
                round_number: roundNumber,
                amount_paid: amount,
                payment_date: todayStr,
                created_at: new Date().toISOString()
              }
              return { ...m, payments: [...payments, newPayment] }
            }
            return m
          })
          return { ...t, members: updatedMembers }
        }
        return t
      })
      localStorage.setItem('fintrack_tontines', JSON.stringify(updated))
      await fetchData()
      return
    }

    // Supabase Mode
    await supabase.from('tontine_payments').insert({
      tontine_id: tontineId,
      member_id: memberId,
      round_number: roundNumber,
      amount_paid: amount,
      payment_date: todayStr
    })
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const payoutTontine = useCallback(async (tontineId: string, memberId: string, payoutDate: string) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_tontines') || '[]')
      const updated = local.map((t: Tontine) => {
        if (t.id === tontineId && t.members) {
          const updatedMembers = t.members.map((m: TontineMember) => {
            if (m.id === memberId) {
              return { ...m, is_paid_out: true, payout_date: payoutDate }
            }
            return m
          })
          return { ...t, members: updatedMembers }
        }
        return t
      })
      localStorage.setItem('fintrack_tontines', JSON.stringify(updated))
      await fetchData()
      return
    }

    // Supabase Mode
    await supabase.from('tontine_members').update({
      is_paid_out: true,
      payout_date: payoutDate
    }).eq('id', memberId)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const deleteTontine = useCallback(async (tontineId: string) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_tontines') || '[]')
      const filtered = local.filter((t: Tontine) => t.id !== tontineId)
      localStorage.setItem('fintrack_tontines', JSON.stringify(filtered))
      await fetchData()
      return
    }

    await supabase.from('tontines').delete().eq('id', tontineId)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  // --- RECURRING TRANSACTIONS CRUD ---
  const addRecurringTransaction = useCallback(async (data: {
    wallet_id: string
    category_id: string
    type: 'income' | 'expense'
    amount: number
    description: string
    merchant: string
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    start_date: string
  }) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_recurring') || '[]')
      local.push({
        id: `rec-${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'local-user',
        ...data,
        last_generated: null,
        is_active: true,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('fintrack_recurring', JSON.stringify(local))
      await fetchData()
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('recurring_transactions').insert({
      user_id: user.id,
      ...data,
      is_active: true
    })
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const deleteRecurringTransaction = useCallback(async (id: string) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_recurring') || '[]')
      const filtered = local.filter((r: any) => r.id !== id)
      localStorage.setItem('fintrack_recurring', JSON.stringify(filtered))
      await fetchData()
      return
    }

    await supabase.from('recurring_transactions').delete().eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  const toggleRecurringTransaction = useCallback(async (id: string, active: boolean) => {
    if (isFallbackMode()) {
      const local = JSON.parse(localStorage.getItem('fintrack_recurring') || '[]')
      const updated = local.map((r: any) => r.id === id ? { ...r, is_active: active } : r)
      localStorage.setItem('fintrack_recurring', JSON.stringify(updated))
      await fetchData()
      return
    }

    await supabase.from('recurring_transactions').update({ is_active: active }).eq('id', id)
    await fetchData()
  }, [supabase, isFallbackMode, fetchData])

  return (
    <AppContext.Provider value={{
      profile,
      transactions,
      wallets,
      categories,
      stats,
      budgets,
      savingsGoals,
      tontines,
      recurringTransactions,
      topSpending,
      aiInsights,
      loading,
      selectedMonth,
      setSelectedMonth,
      addTransaction,
      addBudget,
      addCategory,
      addSavingsGoal,
      updateSavingsGoalAmount,
      addWallet,
      updateProfile,
      deleteTransaction,
      updateTransaction,
      updateWallet,
      deleteWallet,
      updateBudget,
      deleteBudget,
      updateCategory,
      deleteCategory,
      addTontine,
      payTontineRound,
      payoutTontine,
      deleteTontine,
      addRecurringTransaction,
      deleteRecurringTransaction,
      toggleRecurringTransaction,
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
