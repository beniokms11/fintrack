'use client'

import { useApp } from '@/components/providers/AppProvider'
import { formatXOF } from '@/lib/utils'
import BottomNav from '@/components/navigation/BottomNav'
import AddTransactionModal from '@/components/transactions/AddTransactionModal'
import AddBudgetModal from '@/components/budgets/AddBudgetModal'
import { useState } from 'react'
import { Plus, TrendingDown, Pencil, Trash2 } from 'lucide-react'

export default function BudgetsPage() {
  const { budgets, addTransaction, addBudget, updateBudget, deleteBudget, loading } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<any>(null)

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
          <button className="btn btn-sm btn-primary" id="btn-new-budget" onClick={() => { setEditingBudget(null); setShowBudgetModal(true); }}>
            <Plus size={16} /> Nouveau
          </button>
        </header>
        
        <div className="page-content">
          <div className="budget-hero-card" id="budget-summary">
            <span className="bhc-label">TOTAL BUDGET</span>
            <span className="bhc-balance tabular-nums">{formatXOF(totalBudget)}</span>
            <div className="bhc-progress-wrap">
              <span className="bhc-spent-text">{formatXOF(totalSpent)} spent</span>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{
                  width: `${Math.min(overallPct * 100, 100)}%`,
                  background: overallPct >= 1 ? 'var(--color-expense)' : overallPct >= 0.8 ? 'var(--color-warning)' : 'var(--color-accent)',
                }} />
              </div>
              <span className="bhc-left-text">
                {totalBudget > 0 
                  ? (totalBudget - totalSpent > 0 
                      ? `${formatXOF(totalBudget - totalSpent)} restant` 
                      : (totalBudget - totalSpent === 0 ? 'Limite atteinte' : `Dépassement de ${formatXOF(Math.abs(totalBudget - totalSpent))}`))
                  : 'Aucun budget défini'
                }
              </span>
            </div>
          </div>

          <div className="budget-grid">
            {budgets.map(budget => {
              const pct = Math.min((budget.percentage || 0) * 100, 100)
              const isOverBudget = pct >= 100
              const isWarning = pct >= 80 && pct < 100
              
              const strokeColor = isOverBudget ? 'var(--color-expense)' : isWarning ? 'var(--color-warning)' : 'var(--color-accent)'
              const radius = 32
              const circumference = 2 * Math.PI * radius
              const strokeDashoffset = circumference - (pct / 100) * circumference

              return (
                <div key={budget.id} className="budget-card">
                  <div className="bc-top">
                    <span className="bc-icon" style={{ color: strokeColor, background: `${strokeColor}15` }}>
                      {budget.category?.icon || '📌'}
                    </span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingBudget(budget); setShowBudgetModal(true); }}
                        className="btn-icon btn-ghost" style={{ padding: '4px', color: 'var(--color-text-tertiary)' }}
                      ><Pencil size={14} /></button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if(window.confirm('Supprimer ce budget ?')) deleteBudget(budget.id) }}
                        className="btn-icon btn-ghost" style={{ padding: '4px', color: 'var(--color-expense)' }}
                      ><Trash2 size={14} /></button>
                    </div>
                  </div>
                  
                  <div className="bc-chart">
                    <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                      <circle
                        cx="40" cy="40" r={radius}
                        stroke="var(--color-surface-container)"
                        strokeWidth="8" fill="none"
                      />
                      <circle
                        cx="40" cy="40" r={radius}
                        stroke={strokeColor}
                        strokeWidth="8" fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                      />
                    </svg>
                    <div className="bc-pct">
                      <span className="bc-pct-text">{Math.round(pct)}%</span>
                    </div>
                  </div>

                  <div className="bc-info">
                    <span className="bc-name">{budget.category?.name}</span>
                    <span className="bc-amount tabular-nums">
                      {formatXOF(budget.spent || 0)} <span style={{ opacity: 0.5 }}>/ {formatXOF(budget.amount)}</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <style jsx>{`
          .budget-hero-card {
            background: var(--color-surface);
            border-radius: var(--radius-xl);
            padding: var(--space-2xl) var(--space-xl);
            box-shadow: var(--shadow-md);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: var(--space-2xl);
            margin-top: var(--space-md);
          }
          .bhc-label {
            font-size: 11px;
            font-weight: 700;
            color: var(--color-text-tertiary);
            letter-spacing: 0.05em;
            margin-bottom: var(--space-sm);
          }
          .bhc-balance {
            font-size: 36px;
            font-weight: 800;
            color: var(--color-text-primary);
            line-height: 1.1;
            letter-spacing: -0.03em;
            margin-bottom: var(--space-xl);
          }
          .bhc-progress-wrap {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .bhc-spent-text {
            font-size: 14px;
            font-weight: 700;
            color: var(--color-text-primary);
            align-self: flex-start;
          }
          .bhc-left-text {
            font-size: 12px;
            color: var(--color-text-secondary);
            align-self: flex-end;
          }
          .budget-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-md);
            padding-bottom: 100px;
          }
          .budget-card {
            background: var(--color-surface);
            border-radius: var(--radius-xl);
            padding: var(--space-lg);
            box-shadow: var(--shadow-sm);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: var(--space-sm);
            transition: transform var(--transition-fast);
          }
          .budget-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
          }
          .bc-top {
            width: 100%;
            display: flex;
            align-items: flex-start;
          }
          .bc-icon {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }
          .bc-chart {
            position: relative;
            width: 80px;
            height: 80px;
            margin: var(--space-xs) 0;
          }
          .bc-pct {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .bc-pct-text {
            font-size: 16px;
            font-weight: 800;
            color: var(--color-text-primary);
          }
          .bc-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .bc-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--color-text-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 130px;
          }
          .bc-amount {
            font-size: 11px;
            font-weight: 700;
            color: var(--color-text-secondary);
          }
        `}</style>
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
        initialData={editingBudget}
        onSave={(data, id) => {
          if (id) updateBudget(id, data)
          else addBudget(data)
        }}
      />
    </>
  )
}
