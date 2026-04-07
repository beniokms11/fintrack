'use client'

import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatXOF } from '@/lib/utils'
import { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-hero-card" id="card-hero-balance">
      <div className="shc-header">
        <span className="shc-title">Total Balance</span>
        <div className="shc-logo-wrap">
          <Wallet size={16} />
        </div>
      </div>
      
      <div className="shc-balance-section">
        <h1 className="shc-balance tabular-nums font-headline">{formatXOF(stats.totalBalance)}</h1>
        <div className="shc-change">
          {stats.balanceChange >= 0 ? (
            <span className="shc-pill positive">
              <ArrowUpRight size={14} />
              +{stats.balanceChange}%
            </span>
          ) : (
            <span className="shc-pill negative">
              <ArrowDownRight size={14} />
              {stats.balanceChange}%
            </span>
          )}
          <span className="shc-change-text">vs mois dernier</span>
        </div>
      </div>

      <div className="shc-footer">
        <div className="shc-footer-item">
          <span className="shc-footer-label">REVENUS</span>
          <div className="shc-footer-value-row">
            <span className="shc-footer-amount tabular-nums">{formatXOF(stats.totalIncome)}</span>
            <span className="shc-footer-pct positive"><TrendingUp size={12}/></span>
          </div>
        </div>
        <div className="shc-footer-divider" />
        <div className="shc-footer-item">
          <span className="shc-footer-label">DÉPENSES</span>
          <div className="shc-footer-value-row">
            <span className="shc-footer-amount tabular-nums">{formatXOF(stats.totalExpenses)}</span>
            <span className="shc-footer-pct negative"><TrendingDown size={12}/></span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stats-hero-card {
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          margin-top: var(--space-md);
          margin-bottom: var(--space-2xl);
          position: relative;
          z-index: 10;
        }
        .shc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }
        .shc-title {
          font-size: var(--font-size-md);
          color: var(--color-text-secondary);
          font-weight: 500;
        }
        .shc-logo-wrap {
          width: 32px;
          height: 32px;
          background: var(--color-accent-light);
          color: var(--color-accent);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .shc-balance-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          margin-bottom: var(--space-2xl);
        }
        .shc-balance {
          font-size: 38px;
          font-weight: 800;
          color: var(--color-text-primary);
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .shc-change {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-xs);
        }
        .shc-pill {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px 8px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
        }
        .shc-pill.positive {
          background: var(--color-accent-light);
          color: var(--color-accent);
        }
        .shc-pill.negative {
          background: var(--color-expense-light);
          color: var(--color-expense);
        }
        .shc-change-text {
          font-size: 13px;
          color: var(--color-text-tertiary);
        }
        .shc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-lg);
          border-top: 1px solid var(--color-border-light);
        }
        .shc-footer-item {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .shc-footer-divider {
          width: 1px;
          height: 35px;
          background: var(--color-border-light);
          margin: 0 var(--space-lg);
        }
        .shc-footer-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--color-text-tertiary);
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .shc-footer-value-row {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }
        .shc-footer-amount {
          font-size: 16px;
          font-weight: 800;
          color: var(--color-text-primary);
        }
        .shc-footer-pct {
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        .shc-footer-pct.positive { color: var(--color-accent); }
        .shc-footer-pct.negative { color: var(--color-expense); }
      `}</style>
    </div>
  )
}
