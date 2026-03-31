'use client'

import { useState } from 'react'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF, formatDate } from '@/lib/utils'
import { Transaction } from '@/lib/types'
import BottomNav from '@/components/navigation/BottomNav'
import AddTransactionModal from '@/components/transactions/AddTransactionModal'
import { Search, ArrowUpRight, ArrowDownRight, X } from 'lucide-react'

export default function TransactionsPage() {
  const { transactions, addTransaction, loading } = useApp()
  const [search, setSearch] = useState('')

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', animation: 'pulse 2s infinite' }}>
          <span style={{ fontSize: '40px' }}>📋</span>
          <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Chargement de l'historique...</p>
        </div>
      </div>
    )
  }
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.wallet?.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || tx.type === filterType
    return matchesSearch && matchesType
  })

  const grouped = filtered.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const dateKey = tx.date
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(tx)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <>
      <div className="page">
        <header className="page-header">
          <h1 className="page-title">Historique</h1>
        </header>

        <div className="page-content">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher une transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-transactions"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-tabs" id="filter-tabs">
            {[
              { key: 'all' as const, label: 'Tout' },
              { key: 'income' as const, label: 'Revenus' },
              { key: 'expense' as const, label: 'Dépenses' },
            ].map(f => (
              <button
                key={f.key}
                className={`filter-tab ${filterType === f.key ? 'active' : ''}`}
                onClick={() => setFilterType(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {sortedDates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Search size={24} /></div>
              <p className="empty-state-title">Aucune transaction trouvée</p>
              <p className="empty-state-text">Essaie de modifier tes filtres ou ta recherche.</p>
            </div>
          ) : (
            <div className="tx-groups">
              {sortedDates.map(dateKey => (
                <div key={dateKey} className="tx-group">
                  <div className="tx-group-date">{formatDate(dateKey, 'relative')}</div>
                  {grouped[dateKey].map(tx => (
                    <div key={tx.id} className="tx-row">
                      <div className="tx-row-icon"><span>{tx.category?.icon || '📌'}</span></div>
                      <div className="tx-row-info">
                        <span className="tx-row-desc">{tx.description}</span>
                        <span className="tx-row-meta">{tx.category?.name} · {tx.wallet?.name}</span>
                      </div>
                      <div className="tx-row-amount-wrap">
                        <span className={`tx-row-amount tabular-nums ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatXOF(tx.amount)}
                        </span>
                        {tx.type === 'income' ? <ArrowUpRight size={14} style={{ color: 'var(--color-income)' }} /> : <ArrowDownRight size={14} style={{ color: 'var(--color-expense)' }} />}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav onAddClick={() => setShowAddModal(true)} />
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(data) => addTransaction({ ...data, amount: parseFloat(data.amount) })}
      />

      <style jsx>{`
        .search-bar { position: relative; display: flex; align-items: center; }
        :global(.search-icon) { position: absolute; left: 14px; color: var(--color-text-tertiary); pointer-events: none; }
        .search-input { width: 100%; font-family: var(--font-family); font-size: var(--font-size-base); padding: var(--space-md) var(--space-lg) var(--space-md) 42px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); color: var(--color-text-primary); outline: none; transition: border-color var(--transition-fast); }
        .search-input::placeholder { color: var(--color-text-tertiary); }
        .search-input:focus { border-color: var(--color-accent); }
        .search-clear { position: absolute; right: 12px; background: none; border: none; color: var(--color-text-tertiary); cursor: pointer; padding: 4px; }
        .filter-tabs { display: flex; gap: var(--space-xs); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 3px; }
        .filter-tab { flex: 1; padding: var(--space-sm) var(--space-md); font-family: var(--font-family); font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-tertiary); background: transparent; border: none; border-radius: var(--radius-sm); cursor: pointer; transition: all var(--transition-fast); }
        .filter-tab.active { background: var(--color-accent); color: white; }
        .tx-groups { display: flex; flex-direction: column; gap: var(--space-xl); }
        .tx-group-date { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-secondary); margin-bottom: var(--space-sm); text-transform: capitalize; }
        .tx-row { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); margin-bottom: var(--space-sm); }
        .tx-row-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--color-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
        .tx-row-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .tx-row-desc { font-size: var(--font-size-base); font-weight: 500; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tx-row-meta { font-size: var(--font-size-xs); color: var(--color-text-tertiary); }
        .tx-row-amount-wrap { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
        .tx-row-amount { font-size: var(--font-size-base); font-weight: 600; }
      `}</style>
    </>
  )
}
