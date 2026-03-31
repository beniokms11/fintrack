'use client'

import { Budget } from '@/lib/types'
import { formatXOF } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface BudgetProgressProps {
  budgets: Budget[]
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
  return (
    <div className="budget-progress-card" id="card-budget-progress">
      <div className="section-header">
        <h2 className="section-title">Budgets du mois</h2>
        <a href="/budgets" className="section-link">
          Voir tout <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </a>
      </div>

      <div className="budget-list">
        {budgets.slice(0, 3).map((budget) => {
          const pct = budget.percentage || 0
          const isOverBudget = pct >= 1
          const isWarning = pct >= 0.8 && pct < 1

          return (
            <div key={budget.id} className="budget-item">
              <div className="budget-item-header">
                <div className="budget-item-category">
                  <span className="budget-item-icon">{budget.category?.icon || '📌'}</span>
                  <span className="budget-item-name">{budget.category?.name}</span>
                </div>
                <span className={`budget-item-amount tabular-nums ${isOverBudget ? 'amount-expense' : ''}`}>
                  {formatXOF(budget.spent || 0)} / {formatXOF(budget.amount)}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(pct * 100, 100)}%`,
                    background: isOverBudget
                      ? 'var(--color-expense)'
                      : isWarning
                      ? 'var(--color-warning)'
                      : 'var(--color-accent)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .budget-progress-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }
        .budget-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }
        .budget-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }
        .budget-item-category {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .budget-item-icon {
          font-size: 16px;
        }
        .budget-item-name {
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--color-text-primary);
        }
        .budget-item-amount {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  )
}
