'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF, formatPercent } from '@/lib/utils'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export default function StatsPage() {
  const { topSpending, stats } = useApp()
  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Statistiques</h1>
          </div>
        </header>

        <div className="page-content">
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="card" id="stat-income">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingUp size={16} style={{ color: 'var(--color-income)' }} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Revenus</span>
              </div>
              <span className="tabular-nums amount-income" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                {formatXOF(stats.totalIncome)}
              </span>
            </div>
            <div className="card" id="stat-expense">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingDown size={16} style={{ color: 'var(--color-expense)' }} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Dépenses</span>
              </div>
              <span className="tabular-nums amount-expense" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                {formatXOF(stats.totalExpenses)}
              </span>
            </div>
          </div>

          {/* Net */}
          <div className="card" id="stat-net">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>
              Bénéfice net ce mois
            </span>
            <span className={`tabular-nums ${stats.totalIncome - stats.totalExpenses >= 0 ? 'amount-income' : 'amount-expense'}`} style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
              {formatXOF(stats.totalIncome - stats.totalExpenses, { showSign: true })}
            </span>
          </div>

          {/* Top spending */}
          <div className="card">
            <h2 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>Répartition des dépenses</h2>
            {topSpending.map((item, index) => (
              <div key={item.category.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: 'var(--space-md) 0',
                borderBottom: index < topSpending.length - 1 ? '1px solid var(--color-border-light)' : 'none',
              }}>
                <span style={{ fontSize: 20 }}>{item.category.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{item.category.name}</span>
                    <span className="tabular-nums" style={{ fontWeight: 600 }}>{formatXOF(item.total)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${item.percentage * 100}%`, background: item.category.color }} />
                  </div>
                </div>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', width: 36, textAlign: 'right' }}>
                  {formatPercent(item.percentage)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
