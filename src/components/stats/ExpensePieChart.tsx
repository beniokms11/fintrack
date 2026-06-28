'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatXOF } from '@/lib/utils'

interface ExpensePieChartProps {
  topSpending: Array<{
    category: {
      id: string
      name: string
      icon?: string
      color?: string
    }
    total: number
    percentage: number
  }>
  totalExpenses: number
}

export default function ExpensePieChart({ topSpending, totalExpenses }: ExpensePieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!topSpending || topSpending.length === 0) {
    return (
      <div className="card empty-pie-card">
        <h3 className="section-title">Répartition visuelle</h3>
        <div className="empty-pie-content">
          <div className="empty-pie-circle">🍩</div>
          <p>Aucune dépense enregistrée ce mois-ci pour générer le graphique.</p>
        </div>
        <style jsx>{`
          .empty-pie-card {
            padding: var(--space-xl);
            text-align: center;
          }
          .empty-pie-content {
            padding: var(--space-2xl) 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            color: var(--color-text-secondary);
          }
          .empty-pie-circle {
            font-size: 48px;
            opacity: 0.5;
          }
        `}</style>
      </div>
    )
  }

  const activeItem = activeIndex !== null && topSpending[activeIndex] ? topSpending[activeIndex] : null

  return (
    <div className="card pie-chart-card">
      <h3 className="section-title">Répartition par Catégorie</h3>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={topSpending}
              dataKey="total"
              nameKey="category.name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              cornerRadius={8}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              stroke="none"
            >
              {topSpending.map((item, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={item.category.color || 'var(--color-accent)'} 
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                  style={{ transition: 'opacity 0.2s ease, transform 0.2s ease', cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Overlay Text */}
        <div className="chart-center-text font-headline">
          {activeItem ? (
            <div className="center-active animate-fade-in">
              <span className="center-icon">{activeItem.category.icon || '📌'}</span>
              <span className="center-label">{activeItem.category.name}</span>
              <span className="center-amount tabular-nums">{formatXOF(activeItem.total)}</span>
              <span className="center-pct">({Math.round(activeItem.percentage * 100)}%)</span>
            </div>
          ) : (
            <div className="center-default animate-fade-in">
              <span className="center-label">TOTAL DÉPENSES</span>
              <span className="center-amount tabular-nums">{formatXOF(totalExpenses)}</span>
              <span className="center-hint">Survolez un quartier</span>
            </div>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="legend-grid">
        {topSpending.map((item, index) => (
          <div 
            key={item.category.id} 
            className={`legend-item ${activeIndex === index ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="legend-dot" style={{ background: item.category.color || 'var(--color-accent)' }} />
            <span className="legend-name">{item.category.icon} {item.category.name}</span>
            <span className="legend-val tabular-nums">{Math.round(item.percentage * 100)}%</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pie-chart-card {
          padding: var(--space-xl);
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
        }
        .chart-wrapper {
          position: relative;
          width: 100%;
          height: 260px;
          margin: var(--space-md) 0;
        }
        .chart-center-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 130px;
        }
        .center-default, .center-active {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .center-icon {
          font-size: 20px;
        }
        .center-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-secondary);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }
        .center-amount {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.2;
        }
        .center-pct {
          font-size: 12px;
          color: var(--color-accent);
          font-weight: 600;
        }
        .center-hint {
          font-size: 10px;
          color: var(--color-text-tertiary);
          margin-top: 2px;
        }
        .legend-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px 16px;
          margin-top: var(--space-md);
          border-top: 1px solid var(--color-border-light);
          padding-top: var(--space-md);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: var(--font-size-sm);
          padding: 6px 8px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .legend-item:hover, .legend-item.active {
          background: var(--color-surface-container);
          transform: translateX(2px);
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .legend-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--color-text);
        }
        .legend-val {
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        @media (max-width: 480px) {
          .legend-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontSize: '12px'
      }}>
        <p style={{ fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
          {data.category.icon} {data.category.name}
        </p>
        <p style={{ color: data.category.color || 'var(--color-accent)', fontWeight: 700, margin: '4px 0 0' }}>
          {formatXOF(data.total)} ({Math.round(data.percentage * 100)}%)
        </p>
      </div>
    )
  }
  return null
}
