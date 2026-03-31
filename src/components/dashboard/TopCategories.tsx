'use client'

import { SpendingByCategory } from '@/lib/types'
import { formatXOF, formatPercent } from '@/lib/utils'

interface TopCategoriesProps {
  categories: SpendingByCategory[]
}

export default function TopCategories({ categories }: TopCategoriesProps) {
  return (
    <div className="top-categories-card" id="card-top-categories">
      <div className="section-header">
        <h2 className="section-title">Top dépenses</h2>
      </div>

      <div className="category-list">
        {categories.slice(0, 5).map((item, index) => (
          <div key={item.category.id} className="category-item">
            <div className="category-rank">{index + 1}</div>
            <div className="category-icon-wrap" style={{ background: `${item.category.color}15` }}>
              <span>{item.category.icon}</span>
            </div>
            <div className="category-info">
              <span className="category-name">{item.category.name}</span>
              <div className="category-bar-wrap">
                <div
                  className="category-bar"
                  style={{
                    width: `${item.percentage * 100}%`,
                    background: item.category.color,
                  }}
                />
              </div>
            </div>
            <div className="category-value">
              <span className="category-amount tabular-nums">{formatXOF(item.total)}</span>
              <span className="category-pct">{formatPercent(item.percentage)}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .top-categories-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }
        .category-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .category-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .category-rank {
          width: 20px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-tertiary);
          text-align: center;
          flex-shrink: 0;
        }
        .category-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 16px;
        }
        .category-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .category-name {
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--color-text-primary);
        }
        .category-bar-wrap {
          width: 100%;
          height: 4px;
          background: var(--color-border-light);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .category-bar {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width var(--transition-slow);
        }
        .category-value {
          text-align: right;
          flex-shrink: 0;
        }
        .category-amount {
          display: block;
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-text-primary);
        }
        .category-pct {
          display: block;
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
        }
      `}</style>
    </div>
  )
}
