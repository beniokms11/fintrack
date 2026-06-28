'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF, formatPercent } from '@/lib/utils'
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import MonthSelector from '@/components/dashboard/MonthSelector'
import ExpensePieChart from '@/components/stats/ExpensePieChart'
import MonthlyComparisonChart from '@/components/stats/MonthlyComparisonChart'

export default function StatsPage() {
  const { topSpending, stats, transactions, selectedMonth } = useApp()

  return (
    <>
      <div className="page">
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Statistiques & Graphiques</h1>
          </div>
        </header>

        <div className="page-content">
          <MonthSelector />

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div className="card" id="stat-income" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingUp size={16} style={{ color: 'var(--color-income)' }} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>REVENUS</span>
              </div>
              <span className="tabular-nums amount-income font-headline" style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                {formatXOF(stats.totalIncome)}
              </span>
            </div>
            <div className="card" id="stat-expense" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingDown size={16} style={{ color: 'var(--color-expense)' }} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>DÉPENSES</span>
              </div>
              <span className="tabular-nums amount-expense font-headline" style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                {formatXOF(stats.totalExpenses)}
              </span>
            </div>
          </div>

          {/* Net Benefit Banner */}
          <div className="card net-banner" id="stat-net" style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', fontWeight: 600, display: 'block' }}>
                  Capacité d'épargne du mois
                </span>
                <span className={`tabular-nums font-headline ${stats.totalIncome - stats.totalExpenses >= 0 ? 'amount-income' : 'amount-expense'}`} style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                  {formatXOF(stats.totalIncome - stats.totalExpenses, { showSign: true })}
                </span>
              </div>
              <div className="net-icon-badge">
                <BarChart3 size={24} />
              </div>
            </div>
          </div>

          {/* Interactive Charts Section */}
          <div className="charts-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
            <ExpensePieChart topSpending={topSpending} totalExpenses={stats.totalExpenses} />
            <MonthlyComparisonChart transactions={transactions} selectedMonth={selectedMonth} />
          </div>

          {/* Top spending breakdown list */}
          <div className="card breakdown-list-card">
            <h2 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>Détail des Dépenses par Catégorie</h2>
            {topSpending.length === 0 ? (
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--space-lg) 0' }}>
                Aucune dépense sur cette période.
              </p>
            ) : (
              topSpending.map((item, index) => (
                <div key={item.category.id} className="breakdown-item" style={{
                  borderBottom: index < topSpending.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                }}>
                  <div className="bi-icon" style={{ background: `${item.category.color || 'var(--color-accent)'}15` }}>
                    {item.category.icon || '📌'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.category.name}</span>
                      <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--color-text)' }}>{formatXOF(item.total)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${Math.min(item.percentage * 100, 100)}%`, background: item.category.color || 'var(--color-accent)' }} />
                    </div>
                  </div>
                  <span className="bi-pct tabular-nums">
                    {formatPercent(item.percentage)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <BottomNav />

      <style jsx>{`
        .net-banner {
          padding: var(--space-lg) var(--space-xl);
          background: linear-gradient(135deg, var(--color-surface), var(--color-surface-container));
          border-left: 4px solid var(--color-accent);
        }
        .net-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: rgba(79, 70, 229, 0.1);
          color: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
        }
        @media (min-width: 900px) {
          .charts-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .breakdown-list-card {
          padding: var(--space-xl);
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-2xl);
        }
        .breakdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) 0;
        }
        .bi-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .bi-pct {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-secondary);
          width: 48px;
          text-align: right;
        }
      `}</style>
    </>
  )
}
