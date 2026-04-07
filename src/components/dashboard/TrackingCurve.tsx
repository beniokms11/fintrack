'use client'

import { useState, useMemo } from 'react'
import { ChartDataPoint, ChartMode, ChartPeriod, Transaction } from '@/lib/types'
import { CHART_PERIODS } from '@/lib/constants'
import { formatXOF } from '@/lib/utils'
import { TrendingUp, ArrowLeftRight } from 'lucide-react'
import { useApp } from '@/components/providers/AppProvider'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Bar,
} from 'recharts'

export default function TrackingCurve() {
  const { transactions, stats } = useApp()
  const [period, setPeriod] = useState<ChartPeriod>('7d')
  const [mode, setMode] = useState<ChartMode>('balance')

  const toggleMode = () => {
    setMode(prev => prev === 'balance' ? 'income_vs_expense' : 'balance')
  }

  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = []
    const now = new Date()
    now.setHours(23, 59, 59, 999)

    let count: number
    let unit: 'day' | 'month' = 'day'

    switch (period) {
      case '7d': count = 7; unit = 'day'; break
      case '30d': count = 30; unit = 'day'; break
      case '3m': count = 90; unit = 'day'; break
      case '12m': count = 12; unit = 'month'; break
      default: count = 7; unit = 'day'
    }

    const points: { date: Date; dateStr: string; label: string; income: number; expense: number; net: number }[] = []
    
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now)
      if (unit === 'day') {
        d.setDate(d.getDate() - i)
      } else {
        d.setMonth(d.getMonth() - i)
      }
      
      const dateStr = d.toISOString().split('T')[0]
      let label = ''
      
      if (period === '7d') {
        label = d.toLocaleDateString('fr-FR', { weekday: 'short' })
      } else if (period === '30d' || period === '3m') {
        label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
      } else {
        label = d.toLocaleDateString('fr-FR', { month: 'short' })
      }

      points.push({ date: d, dateStr, label, income: 0, expense: 0, net: 0 })
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.date)
      
      const point = points.find(p => {
        if (unit === 'day') {
          return tx.date === p.dateStr
        } else {
          return txDate.getMonth() === p.date.getMonth() && txDate.getFullYear() === p.date.getFullYear()
        }
      })

      if (point) {
        if (tx.type === 'income') point.income += Number(tx.amount)
        if (tx.type === 'expense') point.expense += Number(tx.amount)
        point.net = point.income - point.expense
      }
    })

    const totalNetInPeriod = points.reduce((sum, p) => sum + p.net, 0)
    let runningBalance = stats.totalBalance - totalNetInPeriod

    points.forEach(p => {
      runningBalance += p.net
      data.push({
        date: p.dateStr,
        label: p.label,
        balance: runningBalance,
        income: p.income,
        expense: p.expense
      })
    })

    return data
  }, [transactions, stats.totalBalance, period])

  const insight = useMemo(() => {
    if (chartData.length < 2) return null
    
    const initial = chartData[0].balance || 0
    const current = chartData[chartData.length - 1].balance || 0
    
    if (initial === 0) return `Solde actuel : ${formatXOF(current)}. Ajoute des revenus pour voir ton évolution.`
    
    const diff = current - initial
    const percent = (diff / initial) * 100
    const absPercent = Math.abs(percent).toFixed(1)
    const trend = diff >= 0 ? 'en hausse' : 'en baisse'
    const periodLabel = CHART_PERIODS.find(p => p.key === period)?.label || period
    
    return `Ton solde est ${trend} de ${absPercent}% sur les ${periodLabel}. ${diff >= 0 ? 'Bonne tendance !' : 'Attention à tes dépenses.'}`
  }, [chartData, period])

  return (
    <div className="tracking-curve-card" id="card-tracking-curve">
      <div className="curve-header">
        <div className="curve-title-row">
          <div className="curve-title-wrap">
            <h2 className="curve-section-title font-headline">Courbe de suivi</h2>
          </div>
          <button className="curve-mode-toggle" onClick={toggleMode} title="Changer de mode">
            <ArrowLeftRight size={13} />
            {mode === 'balance' ? 'Solde' : 'Rev. vs Dép.'}
          </button>
        </div>

        <div className="curve-periods">
          {CHART_PERIODS.map(p => (
            <button
              key={p.key}
              className={`curve-period-btn ${period === p.key ? 'active' : ''}`}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="curve-chart-wrap">
        <ResponsiveContainer width="100%" height={220}>
          {mode === 'balance' ? (
            <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#10B981" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)', fontFamily: 'Inter' }}
                axisLine={false}
                tickLine={false}
                interval={period === '30d' ? 6 : period === '3m' ? 14 : 0}
              />
              <YAxis
                hide={false}
                tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)', fontFamily: 'Inter' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => formatXOF(val, { compact: true })}
                domain={['auto', 'auto']}
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#gradBalance)"
                dot={false}
                activeDot={{ r: 5, fill: '#10B981', stroke: 'var(--color-surface)', strokeWidth: 3 }}
              />
            </AreaChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)', fontFamily: 'Inter' }}
                axisLine={false}
                tickLine={false}
                interval={period === '30d' ? 6 : period === '3m' ? 14 : 0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)', fontFamily: 'Inter' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => formatXOF(val, { compact: true })}
              />
              <Tooltip content={<CustomTooltipComparison />} />
              <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.85} barSize={period === '12m' ? 20 : 8} />
              <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.85} barSize={period === '12m' ? 20 : 8} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="var(--color-text-tertiary)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {insight && (
        <div className="curve-insight">
          <span className="curve-insight-text">{insight}</span>
        </div>
      )}

      <style jsx>{`
        .tracking-curve-card {
           background: var(--color-surface);
           border: none;
           border-radius: var(--radius-xl);
           padding: var(--space-xl) var(--space-lg);
           min-height: 380px;
           display: flex;
           flex-direction: column;
           box-shadow: var(--shadow-md);
           margin-bottom: var(--space-2xl);
        }
        .curve-header {
          margin-bottom: var(--space-lg);
        }
        .curve-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }
        .curve-title-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .curve-section-title {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
        }
        .curve-mode-toggle {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          font-size: 10px;
          font-weight: 700;
          font-family: var(--font-headline);
          color: var(--color-text-secondary);
          background: var(--color-surface-container-low);
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .curve-mode-toggle:hover {
          background: var(--color-surface-container);
          color: var(--color-text-primary);
        }
        .curve-periods {
          display: flex;
          gap: 2px;
          background: var(--color-surface-container);
          border-radius: var(--radius-full);
          padding: 3px;
        }
        .curve-period-btn {
          flex: 1;
          padding: 7px 4px;
          font-family: var(--font-headline);
          font-size: 10px;
          font-weight: 700;
          color: var(--color-text-tertiary);
          background: transparent;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .curve-period-btn.active {
          background: var(--color-surface);
          color: var(--color-accent);
          box-shadow: var(--shadow-sm);
        }
        .curve-chart-wrap {
          margin: 0 calc(-1 * var(--space-sm));
          flex: 1;
        }
        .curve-insight {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-md);
          padding: var(--space-md);
          background: var(--color-accent-subtle);
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--color-accent);
        }
        .curve-insight-text {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          line-height: 1.4;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background: 'var(--color-surface-elevated)',
      border: 'none',
      borderRadius: '16px',
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      zIndex: 100,
    }}>
      <p style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', marginBottom: '4px', fontWeight: 600, fontFamily: 'Manrope' }}>{label}</p>
      <p style={{ fontSize: '16px', fontWeight: 800, color: '#10B981', fontVariantNumeric: 'tabular-nums', fontFamily: 'Manrope' }}>
        {formatXOF(payload[0].value)}
      </p>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltipComparison({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background: 'var(--color-surface-elevated)',
      border: 'none',
      borderRadius: '16px',
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      zIndex: 100,
    }}>
      <p style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', marginBottom: '6px', fontWeight: 600, fontFamily: 'Manrope' }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {payload.map((item: { dataKey: string; value: number; color: string }) => (
          <div key={item.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              {item.dataKey === 'income' ? 'Revenus' : item.dataKey === 'expense' ? 'Dépenses' : 'Solde'}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 800,
              color: item.color || 'var(--color-text-primary)',
              fontVariantNumeric: 'tabular-nums',
              fontFamily: 'Manrope',
            }}>
              {formatXOF(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
