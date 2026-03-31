'use client'

import { useState } from 'react'
import { ChartDataPoint, ChartMode, ChartPeriod } from '@/lib/types'
import { CHART_PERIODS } from '@/lib/constants'
import { formatXOF } from '@/lib/utils'
import { TrendingUp, ArrowLeftRight } from 'lucide-react'
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

interface TrackingCurveProps {
  data: ChartDataPoint[]
  insight?: string
}

export default function TrackingCurve({ data, insight }: TrackingCurveProps) {
  const [period, setPeriod] = useState<ChartPeriod>('30d')
  const [mode, setMode] = useState<ChartMode>('balance')

  const toggleMode = () => {
    setMode(prev => prev === 'balance' ? 'income_vs_expense' : 'balance')
  }

  return (
    <div className="tracking-curve-card" id="card-tracking-curve">
      <div className="curve-header">
        <div className="curve-title-row">
          <div className="curve-title-wrap">
            <TrendingUp size={18} className="curve-title-icon" />
            <h2 className="section-title">Courbe de suivi</h2>
          </div>
          <button className="btn btn-sm btn-ghost curve-mode-btn" onClick={toggleMode} title="Changer de mode">
            <ArrowLeftRight size={14} />
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
            <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => formatXOF(val, { compact: true })}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#gradBalance)"
                dot={false}
                activeDot={{ r: 5, fill: '#10B981', stroke: 'var(--color-surface)', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <ComposedChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => formatXOF(val, { compact: true })}
              />
              <Tooltip content={<CustomTooltipComparison />} />
              <Bar dataKey="income" fill="#10B981" radius={[3, 3, 0, 0]} opacity={0.8} barSize={12} />
              <Bar dataKey="expense" fill="#EF4444" radius={[3, 3, 0, 0]} opacity={0.8} barSize={12} />
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
          <span className="curve-insight-dot" />
          <span className="curve-insight-text">{insight}</span>
        </div>
      )}

      <style jsx>{`
        .tracking-curve-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
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
        :global(.curve-title-icon) {
          color: var(--color-accent);
        }
        .curve-mode-btn {
          font-size: var(--font-size-xs) !important;
        }
        .curve-periods {
          display: flex;
          gap: var(--space-xs);
          background: var(--color-bg);
          border-radius: var(--radius-md);
          padding: 3px;
        }
        .curve-period-btn {
          flex: 1;
          padding: var(--space-xs) var(--space-sm);
          font-family: var(--font-family);
          font-size: var(--font-size-xs);
          font-weight: 500;
          color: var(--color-text-tertiary);
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .curve-period-btn.active {
          background: var(--color-surface);
          color: var(--color-text-primary);
          box-shadow: var(--shadow-sm);
        }
        .curve-chart-wrap {
          margin: 0 calc(-1 * var(--space-sm));
        }
        .curve-insight {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-md);
          padding: var(--space-md);
          background: var(--color-accent-subtle);
          border-radius: var(--radius-sm);
        }
        .curve-insight-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background: var(--color-accent);
          flex-shrink: 0;
        }
        .curve-insight-text {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          line-height: 1.4;
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
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '8px 12px',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#10B981', fontVariantNumeric: 'tabular-nums' }}>
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
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '8px 12px',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>{label}</p>
      {payload.map((item: { dataKey: string; value: number; color: string }) => (
        <p key={item.dataKey} style={{
          fontSize: '13px',
          fontWeight: 600,
          color: item.color || 'var(--color-text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {item.dataKey === 'income' ? 'Revenus' : item.dataKey === 'expense' ? 'Dépenses' : 'Solde'}: {formatXOF(item.value)}
        </p>
      ))}
    </div>
  )
}
