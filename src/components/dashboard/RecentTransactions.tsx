'use client'

import { Transaction } from '@/lib/types'
import { formatXOF, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 5)

  return (
    <div className="recent-transactions" id="card-recent-transactions">
      <div className="section-header">
        <h2 className="section-title">Transactions récentes</h2>
        <a href="/transactions" className="section-link">
          Tout voir <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </a>
      </div>

      <div className="tx-list">
        {recent.map((tx) => (
          <div key={tx.id} className="tx-item" id={`tx-${tx.id}`}>
            <div className="tx-icon-wrap">
              <span className="tx-icon">{tx.category?.icon || '📌'}</span>
            </div>
            <div className="tx-info">
              <span className="tx-description">{tx.description}</span>
              <span className="tx-meta">
                {tx.category?.name} · {tx.wallet?.name} · {formatDate(tx.date, 'relative')}
              </span>
            </div>
            <div className="tx-amount-wrap">
              <span className={`tx-amount tabular-nums ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatXOF(tx.amount)}
              </span>
              {tx.type === 'income' ? (
                <ArrowUpRight size={14} className="tx-arrow-income" />
              ) : (
                <ArrowDownRight size={14} className="tx-arrow-expense" />
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .recent-transactions {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }
        .tx-list {
          display: flex;
          flex-direction: column;
        }
        .tx-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) 0;
          border-bottom: 1px solid var(--color-border-light);
        }
        .tx-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .tx-item:first-child {
          padding-top: 0;
        }
        .tx-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--color-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tx-icon {
          font-size: 18px;
        }
        .tx-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tx-description {
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--color-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tx-meta {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
        }
        .tx-amount-wrap {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }
        .tx-amount {
          font-size: var(--font-size-base);
          font-weight: 600;
        }
        :global(.tx-arrow-income) {
          color: var(--color-income);
        }
        :global(.tx-arrow-expense) {
          color: var(--color-expense);
        }
      `}</style>
    </div>
  )
}
