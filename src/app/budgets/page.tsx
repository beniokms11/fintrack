'use client'

import { useApp } from '@/components/providers/AppProvider'
import { formatXOF } from '@/lib/utils'
import BottomNav from '@/components/navigation/BottomNav'
import AddTransactionModal from '@/components/transactions/AddTransactionModal'
import AddBudgetModal from '@/components/budgets/AddBudgetModal'
import { useState } from 'react'
import { Plus, TrendingDown } from 'lucide-react'

export default function BudgetsPage() {
  const { budgets, addTransaction, addBudget, loading } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', animation: 'pulse 2s infinite' }}>
          <span style={{ fontSize: '40px' }}>🎯</span>
          <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Chargement des budgets...</p>
        </div>
      </div>
    )
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0)
  const overallPct = totalBudget > 0 ? totalSpent / totalBudget : 0

  return (
    <>
      <div className="page">
        <header className="page-header">
          <h1 className="page-title">Budgets</h1>
          <button className="btn btn-sm btn-primary" id="btn-new-budget" onClick={() => setShowBudgetModal(true)}>
            <Plus size={16} /> Nouveau
          </button>
        </header>

        <div className="page-content">
          <div className="card" id="budget-summary">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <TrendingDown size={18} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Budget total du mois</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="tabular-nums" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{formatXOF(totalSpent)}</span>
              <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
              <span className="tabular-nums" style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>{formatXOF(totalBudget)}</span>
            </div>
            <div className="progress-bar" style={{ height: 8, marginTop: 12 }}>
              <div className="progress-bar-fill" style={{
                width: `${Math.min(overallPct * 100, 100)}%`,
                background: overallPct >= 1 ? 'var(--color-expense)' : overallPct >= 0.8 ? 'var(--color-warning)' : 'var(--color-accent)',
              }} />
            </div>
            <span style={{ display: 'block', marginTop: '8px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {totalBudget - totalSpent > 0 ? `Il te reste ${formatXOF(totalBudget - totalSpent)} ce mois` : 'Budget dépassé !'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {budgets.map(budget => {
              const pct = budget.percentage || 0
              const isOver = pct >= 1
              const isWarning = pct >= 0.8 && pct < 1
              return (
                <div key={budget.id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: 20 }}>{budget.category?.icon || '📌'}</span>
                      <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>{budget.category?.name}</span>
                    </div>
                    {isOver && <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-expense-light)', color: 'var(--color-expense)' }}>Dépassé</span>}
                    {isWarning && <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>Attention</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                    <span className={`tabular-nums ${isOver ? 'amount-expense' : ''}`} style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{formatXOF(budget.spent || 0)}</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>sur {formatXOF(budget.amount)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{
                      width: `${Math.min(pct * 100, 100)}%`,
                      background: isOver ? 'var(--color-expense)' : isWarning ? 'var(--color-warning)' : 'var(--color-accent)',
                    }} />
                  </div>
                  <span style={{ display: 'block', marginTop: '8px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                    {(budget.remaining || 0) > 0 ? `Reste : ${formatXOF(budget.remaining || 0)}` : 'Limite atteinte'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav onAddClick={() => setShowAddModal(true)} />
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(data) => addTransaction({ ...data, amount: parseFloat(data.amount) })}
      />
      <AddBudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSave={addBudget}
      />
    </>
  )
}
