'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatXOF } from '@/lib/utils'

interface MonthlyComparisonChartProps {
  transactions: Array<{
    id: string
    date: string
    amount: number
    type: 'income' | 'expense'
  }>
  selectedMonth: string
}

export default function MonthlyComparisonChart({ transactions, selectedMonth }: MonthlyComparisonChartProps) {
  const chartData = useMemo(() => {
    const weeks = [
      { name: 'Semaine 1', income: 0, expense: 0, days: '1 - 7' },
      { name: 'Semaine 2', income: 0, expense: 0, days: '8 - 14' },
      { name: 'Semaine 3', income: 0, expense: 0, days: '15 - 21' },
      { name: 'Semaine 4+', income: 0, expense: 0, days: '22+' },
    ]

    transactions.forEach(tx => {
      if (!tx.date.startsWith(selectedMonth)) return
      const day = parseInt(tx.date.split('-')[2], 10)
      let weekIdx = 0
      if (day >= 8 && day <= 14) weekIdx = 1
      else if (day >= 15 && day <= 21) weekIdx = 2
      else if (day >= 22) weekIdx = 3

      if (tx.type === 'income') weeks[weekIdx].income += Number(tx.amount)
      if (tx.type === 'expense') weeks[weekIdx].expense += Number(tx.amount)
    })

    return weeks
  }, [transactions, selectedMonth])

  const hasData = chartData.some(w => w.income > 0 || w.expense > 0)

  return (
    <div className="card comparison-chart-card">
      <div className="card-header">
        <div>
          <h3 className="section-title">Évolution Hebdomadaire</h3>
          <p className="card-subtitle">Comparatif Revenus vs Dépenses par semaine</p>
        </div>
        <div className="chart-legend">
          <span className="legend-badge income">Revenus</span>
          <span className="legend-badge expense">Dépenses</span>
        </div>
      </div>

      {!hasData ? (
        <div className="empty-chart">
          <p>Aucune transaction enregistrée pour ce mois.</p>
        </div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                width={45}
              />
              <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'var(--color-surface-container)', opacity: 0.4 }} />
              <Bar dataKey="income" name="Revenus" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expense" name="Dépenses" fill="var(--color-expense)" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <style jsx>{`
        .comparison-chart-card {
          padding: var(--space-xl);
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
          gap: 12px;
        }
        .card-subtitle {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          margin-top: 2px;
        }
        .chart-legend {
          display: flex;
          gap: 12px;
        }
        .legend-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-badge::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .legend-badge.income {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
        }
        .legend-badge.income::before {
          background: #10B981;
        }
        .legend-badge.expense {
          background: rgba(244, 63, 94, 0.1);
          color: var(--color-expense);
        }
        .legend-badge.expense::before {
          background: var(--color-expense);
        }
        .chart-container {
          width: 100%;
          height: 260px;
        }
        .empty-chart {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }
      `}</style>
    </div>
  )
}

function ComparisonTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '10px 14px',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        fontSize: '12px'
      }}>
        <p style={{ fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '4px' }}>
          {label} <span style={{ opacity: 0.6, fontSize: '11px', fontWeight: 500 }}>({data.days})</span>
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: '#10B981', fontWeight: 600, margin: '4px 0' }}>
          <span>Revenus :</span>
          <span className="tabular-nums">+{formatXOF(data.income)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: 'var(--color-expense)', fontWeight: 600, margin: '4px 0' }}>
          <span>Dépenses :</span>
          <span className="tabular-nums">-{formatXOF(data.expense)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: 'var(--color-text)', fontWeight: 700, margin: '6px 0 0', borderTop: '1px dashed var(--color-border-light)', paddingTop: '4px' }}>
          <span>Solde net :</span>
          <span className="tabular-nums">{formatXOF(data.income - data.expense, { showSign: true })}</span>
        </div>
      </div>
    )
  }
  return null
}
