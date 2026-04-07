'use client'

import { Budget } from '@/lib/types'
import { formatXOF } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface BudgetProgressProps {
  budgets: Budget[]
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
  return (
    <div className="budget-progress-section" id="card-budget-progress">
      <div className="section-header">
        <h2 className="section-title">Budgets</h2>
        <a href="/budgets" className="section-link">
          Voir tout <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </a>
      </div>

      <div className="budget-grid">
        {budgets.slice(0, 4).map((budget) => {
          const pct = Math.min((budget.percentage || 0) * 100, 100)
          const isOverBudget = pct >= 100
          const isWarning = pct >= 80 && pct < 100
          
          const strokeColor = isOverBudget ? 'var(--color-expense)' : isWarning ? 'var(--color-warning)' : 'var(--color-accent)'
          const radius = 24
          const circumference = 2 * Math.PI * radius
          const strokeDashoffset = circumference - (pct / 100) * circumference

          return (
            <div key={budget.id} className="budget-card">
              <div className="bc-top">
                <span className="bc-icon" style={{ color: strokeColor, background: `${strokeColor}15` }}>
                  {budget.category?.icon || '📌'}
                </span>
              </div>
              
              <div className="bc-chart">
                <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="35" cy="35" r={radius}
                    stroke="var(--color-surface-container)"
                    strokeWidth="6" fill="none"
                  />
                  <circle
                    cx="35" cy="35" r={radius}
                    stroke={strokeColor}
                    strokeWidth="6" fill="none"
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

      <style jsx>{`
        .budget-progress-section {
          margin-bottom: var(--space-2xl);
        }
        .budget-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-md);
        }
        .budget-card {
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-sm);
        }
        .bc-top {
          width: 100%;
          display: flex;
          justify-content: flex-start;
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
          width: 70px;
          height: 70px;
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
          font-size: 14px;
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
          max-width: 100px;
        }
        .bc-amount {
          font-size: 10px;
          font-weight: 700;
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  )
}
