'use client'

import { useState } from 'react'
import { useApp } from '@/components/providers/AppProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { getGreeting } from '@/lib/utils'
import BottomNav from '@/components/navigation/BottomNav'
import StatsCards from '@/components/dashboard/StatsCards'
import QuoteCard from '@/components/dashboard/QuoteCard'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import BudgetProgress from '@/components/dashboard/BudgetProgress'
import TopCategories from '@/components/dashboard/TopCategories'
import AIInsightCard from '@/components/dashboard/AIInsightCard'
import TrackingCurve from '@/components/dashboard/TrackingCurve'
import MonthSelector from '@/components/dashboard/MonthSelector'
import AddTransactionModal from '@/components/transactions/AddTransactionModal'
import { Bell, Sun, Moon, Plus } from 'lucide-react'

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTx, setEditingTx] = useState<any>(null)
  const { profile, transactions, stats, budgets, topSpending, aiInsights, addTransaction, updateTransaction, loading } = useApp()
  const { theme, toggleTheme } = useTheme()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', animation: 'pulse 2s infinite' }}>
          <span style={{ fontSize: '40px' }}>📊</span>
          <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Chargement de tes finances...</p>
        </div>
      </div>
    )
  }

  const handleSaveTransaction = (data: {
    type: 'income' | 'expense'
    amount: string
    category_id: string
    wallet_id: string
    date: string
    description: string
    merchant: string
  }, id?: string) => {
    if (id) {
      updateTransaction(id, { ...data, amount: parseFloat(data.amount) })
    } else {
      addTransaction({
        ...data,
        amount: parseFloat(data.amount),
      })
    }
  }

  // Get user initials for avatar
  const rawName = profile?.full_name?.trim() || 'Utilisateur'
  const displayName = rawName.split(' ')[0]
  const initials = rawName !== 'Utilisateur'
    ? rawName.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2)
    : 'UF'

  return (
    <>
      <div className="page">
        {/* Header — Glassmorphic TopAppBar */}
        <header className="dashboard-header" id="dashboard-header">
          <div className="dashboard-header-left">
            <div className="dashboard-avatar">
              <span className="dashboard-avatar-text">{initials}</span>
            </div>
            <div className="dashboard-header-info">
              <span className="dashboard-logo-text font-headline">FinTrack</span>
              <span className="dashboard-greeting" suppressHydrationWarning>
                {getGreeting()}, {displayName} 👋
              </span>
            </div>
          </div>
          <div className="dashboard-header-actions">
            <button
              className="btn btn-icon btn-ghost header-theme-btn"
              onClick={toggleTheme}
              aria-label="Changer de thème"
              id="btn-theme-toggle"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="btn btn-icon btn-ghost" aria-label="Notifications" id="btn-notifications">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <MonthSelector />
          <StatsCards stats={stats} />
          <TrackingCurve />
          <QuoteCard />
          <AIInsightCard insights={aiInsights} />
          <BudgetProgress budgets={budgets} />
          <RecentTransactions transactions={transactions} onEdit={(tx) => { setEditingTx(tx); setShowAddModal(true) }} />
          <TopCategories categories={topSpending} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav onAddClick={() => { setEditingTx(null); setShowAddModal(true) }} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingTx(null) }}
        initialData={editingTx}
        onSave={handleSaveTransaction}
      />

    </>
  )
}
