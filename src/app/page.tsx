'use client'

import { useState } from 'react'
import { useApp } from '@/components/providers/AppProvider'
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
import { Bell } from 'lucide-react'

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const { transactions, stats, budgets, topSpending, chartData, aiInsights, addTransaction, loading } = useApp()

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
  }) => {
    addTransaction({
      ...data,
      amount: parseFloat(data.amount),
    })
  }

  return (
    <>
      <div className="page">
        {/* Header */}
        <header className="dashboard-header" id="dashboard-header">
          <div className="dashboard-header-left">
            <div className="dashboard-logo">
              <span className="dashboard-logo-icon">📊</span>
              <span className="dashboard-logo-text">FinTrack</span>
            </div>
            <span className="dashboard-greeting">{getGreeting()} 👋</span>
          </div>
          <div className="dashboard-header-actions">
            <button className="btn btn-icon btn-ghost" aria-label="Notifications" id="btn-notifications">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <QuoteCard />
          <StatsCards stats={stats} />
          <TrackingCurve
            data={chartData}
            insight="Ton solde est en hausse de 12,5% sur les 30 derniers jours. Bonne tendance !"
          />
          <AIInsightCard insights={aiInsights} />
          <BudgetProgress budgets={budgets} />
          <RecentTransactions transactions={transactions} />
          <TopCategories categories={topSpending} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav onAddClick={() => setShowAddModal(true)} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
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
          background: var(--color-bg);
          z-index: 50;
        }
        .dashboard-header-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .dashboard-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .dashboard-logo-icon {
          font-size: 20px;
        }
        .dashboard-logo-text {
          font-size: var(--font-size-lg);
          font-weight: 800;
          color: var(--color-text-primary);
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
      `}</style>
    </>
  )
}
