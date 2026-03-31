'use client'

import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatXOF } from '@/lib/utils'
import { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-cards">
      {/* Total Balance - Hero card */}
      <div className="stats-card stats-card-hero" id="card-balance">
        <div className="stats-card-header">
          <div className="stats-card-icon stats-card-icon-accent">
            <Wallet size={18} />
          </div>
          <span className="stats-card-label">Solde total</span>
        </div>
        <div className="stats-card-value-row">
          <span className="stats-card-value tabular-nums">{formatXOF(stats.totalBalance)}</span>
        </div>
        <div className="stats-card-change">
          {stats.balanceChange >= 0 ? (
            <span className="stats-change-positive">
              <ArrowUpRight size={14} />
              +{stats.balanceChange}%
            </span>
          ) : (
            <span className="stats-change-negative">
              <ArrowDownRight size={14} />
              {stats.balanceChange}%
            </span>
          )}
          <span className="stats-change-period">vs mois dernier</span>
        </div>
      </div>

      {/* Grid: Income, Expense, Savings */}
      <div className="stats-grid">
        <div className="stats-card" id="card-income">
          <div className="stats-card-header">
            <div className="stats-card-icon stats-card-icon-income">
              <TrendingUp size={16} />
            </div>
            <span className="stats-card-label">Revenus</span>
          </div>
          <span className="stats-card-value stats-card-value-sm tabular-nums amount-income">
            {formatXOF(stats.totalIncome)}
          </span>
        </div>

        <div className="stats-card" id="card-expense">
          <div className="stats-card-header">
            <div className="stats-card-icon stats-card-icon-expense">
              <TrendingDown size={16} />
            </div>
            <span className="stats-card-label">Dépenses</span>
          </div>
          <span className="stats-card-value stats-card-value-sm tabular-nums amount-expense">
            {formatXOF(stats.totalExpenses)}
          </span>
        </div>

        <div className="stats-card" id="card-savings">
          <div className="stats-card-header">
            <div className="stats-card-icon stats-card-icon-savings">
              <PiggyBank size={16} />
            </div>
            <span className="stats-card-label">Épargne</span>
          </div>
          <span className="stats-card-value stats-card-value-sm tabular-nums">
            {formatXOF(stats.totalSavings)}
          </span>
        </div>
      </div>

      <style jsx>{`
        .stats-cards {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .stats-card {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          padding: var(--space-lg);
        }
        .stats-card-hero {
          background: linear-gradient(135deg, var(--color-accent), #059669);
          border: none;
          color: white;
        }
        .stats-card-hero .stats-card-label {
          color: rgba(255, 255, 255, 0.8);
        }
        .stats-card-hero .stats-card-icon-accent {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        .stats-card-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }
        .stats-card-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stats-card-icon-income {
          background: var(--color-accent-light);
          color: var(--color-income);
        }
        .stats-card-icon-expense {
          background: var(--color-expense-light);
          color: var(--color-expense);
        }
        .stats-card-icon-savings {
          background: var(--color-warning-light);
          color: var(--color-warning);
        }
        .stats-card-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          font-weight: 500;
        }
        .stats-card-value {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        .stats-card-value-sm {
          font-size: var(--font-size-lg);
        }
        .stats-card-value-row {
          display: flex;
          align-items: baseline;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }
        .stats-card-change {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .stats-change-positive {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }
        .stats-change-negative {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: #FCA5A5;
          background: rgba(239, 68, 68, 0.2);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }
        .stats-change-period {
          font-size: var(--font-size-xs);
          color: rgba(255, 255, 255, 0.6);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--space-md);
        }
        @media (max-width: 400px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .stats-card-value-sm {
            font-size: var(--font-size-md);
          }
        }
      `}</style>
    </div>
  )
}
