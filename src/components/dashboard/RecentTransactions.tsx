'use client'

import { Transaction } from '@/lib/types'
import { formatXOF, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, ChevronRight, Trash2, Pencil } from 'lucide-react'
import { useApp } from '@/components/providers/AppProvider'

interface RecentTransactionsProps {
  transactions: Transaction[]
  onEdit?: (tx: Transaction) => void
}

export default function RecentTransactions({ transactions, onEdit }: RecentTransactionsProps) {
  const { deleteTransaction } = useApp()
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
              <span className={`tx-amount tabular-nums font-headline ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatXOF(tx.amount)}
              </span>
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  if (onEdit) onEdit(tx)
                }}
                className="btn-icon btn-ghost"
                style={{ color: 'var(--color-text-secondary)', padding: '4px', marginLeft: '8px' }}
                title="Modifier"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  if (window.confirm('Supprimer cette transaction ?')) {
                    deleteTransaction(tx.id)
                  }
                }}
                className="btn-icon btn-ghost"
                style={{ color: 'var(--color-expense)', padding: '4px' }}
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .recent-transactions {
          background: var(--color-surface);
          border: none;
          border-radius: var(--radius-xl);
          padding: var(--space-xl) var(--space-lg);
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
          margin-bottom: var(--space-2xl);
        }
        .tx-list {
          display: flex;
          flex-direction: column;
        }
        .tx-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-sm);
          border-bottom: 1px solid var(--color-border-light);
          transition: background var(--transition-fast);
          cursor: pointer;
        }
        .tx-item:hover {
          background: var(--color-surface-hover);
        }
        .tx-item:last-child {
          border-bottom: none;
          padding-bottom: var(--space-xs);
        }
        .tx-item:first-child {
          padding-top: var(--space-xs);
        }
        .tx-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: var(--color-surface-container-low);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }
        .tx-item:hover .tx-icon-wrap {
          transform: scale(1.05);
        }
        .tx-icon {
          font-size: 18px;
        }
        .tx-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .tx-description {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tx-meta {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          font-weight: 500;
        }
        .tx-amount-wrap {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }
        .tx-amount {
          font-size: var(--font-size-base);
          font-weight: 700;
        }
      `}</style>
    </div>
  )
}
