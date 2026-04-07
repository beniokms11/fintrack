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
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '👤'

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
                {getGreeting()}{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
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

      <style jsx>{`
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg) var(--space-lg) var(--space-md);
          position: sticky;
          top: 0;
          background: rgba(245, 247, 250, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 50;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }
        [data-theme="dark"] .dashboard-header {
          background: rgba(11, 13, 20, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .dashboard-header-left {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .dashboard-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        .dashboard-avatar-text {
          font-size: var(--font-size-sm);
          font-weight: 700;
          color: white;
          font-family: var(--font-headline);
          letter-spacing: 0.02em;
        }
        .dashboard-header-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .dashboard-logo-text {
          font-size: var(--font-size-lg);
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.03em;
        }
        .dashboard-greeting {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
        .dashboard-header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }
        .header-theme-btn {
          border-radius: var(--radius-full);
        }
      `}</style>
    </>
  )
}
