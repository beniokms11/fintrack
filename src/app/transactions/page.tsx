'use client'

import { useState } from 'react'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF, formatDate } from '@/lib/utils'
import { Transaction } from '@/lib/types'
import BottomNav from '@/components/navigation/BottomNav'
import AddTransactionModal from '@/components/transactions/AddTransactionModal'
import { Search, ArrowUpRight, ArrowDownRight, X, Trash2, Pencil } from 'lucide-react'

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction, loading } = useApp()
  const [search, setSearch] = useState('')
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

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
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingTx(tx)
                            setShowAddModal(true)
                          }}
                          className="btn-icon btn-ghost"
                          style={{ color: 'var(--color-text-secondary)', padding: '4px', marginLeft: '8px' }}
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
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
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav onAddClick={() => {
        setEditingTx(null)
        setShowAddModal(true)
      }} />
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingTx(null)
        }}
        initialData={editingTx}
        onSave={(data, id) => {
          if (id) {
            updateTransaction(id, { ...data, amount: parseFloat(data.amount) })
          } else {
            addTransaction({ ...data, amount: parseFloat(data.amount) })
          }
        }}
      />

      <style jsx>{`
        .search-bar { position: relative; display: flex; align-items: center; margin-bottom: var(--space-lg); }
        :global(.search-icon) { position: absolute; left: 16px; color: var(--color-text-tertiary); pointer-events: none; }
        .search-input { width: 100%; font-family: var(--font-family); font-size: var(--font-size-base); padding: var(--space-lg) var(--space-lg) var(--space-lg) 48px; border: none; border-radius: var(--radius-xl); background: var(--color-surface); color: var(--color-text-primary); box-shadow: var(--shadow-sm); outline: none; transition: box-shadow var(--transition-fast); }
        .search-input::placeholder { color: var(--color-text-tertiary); }
        .search-input:focus { box-shadow: var(--shadow-md); }
        .search-clear { position: absolute; right: 12px; background: none; border: none; color: var(--color-text-tertiary); cursor: pointer; padding: 4px; }
        .filter-tabs { display: flex; gap: var(--space-sm); background: transparent; padding: 4px 0; margin-bottom: var(--space-xl); }
        .filter-tab { flex: 1; padding: 12px 16px; font-family: var(--font-headline); font-size: 13px; font-weight: 700; color: var(--color-text-secondary); background: var(--color-surface); border: 2px solid transparent; border-radius: var(--radius-full); cursor: pointer; transition: all var(--transition-base); box-shadow: var(--shadow-sm); }
        .filter-tab.active { background: var(--color-accent); color: white; border-color: var(--color-accent); box-shadow: 0 8px 16px var(--color-accent-glow); }
        .tx-groups { display: flex; flex-direction: column; gap: var(--space-2xl); padding-bottom: 100px; }
        .tx-group { display: flex; flex-direction: column; gap: var(--space-md); }
        .tx-group-date { font-size: 12px; font-weight: 700; font-family: var(--font-headline); color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; padding-left: var(--space-sm); }
        .tx-row { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); background: var(--color-surface); border: none; border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); transition: transform var(--transition-fast), box-shadow var(--transition-fast); }
        .tx-row:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); background: var(--color-surface); }
        .tx-row-icon { width: 48px; height: 48px; border-radius: var(--radius-full); background: var(--color-surface-container-low); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 20px; transition: transform var(--transition-fast); }
        .tx-row:hover .tx-row-icon { transform: scale(1.05); }
        .tx-row-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .tx-row-desc { font-size: 16px; font-weight: 700; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tx-row-meta { font-size: 12px; font-weight: 500; color: var(--color-text-tertiary); }
        .tx-row-amount-wrap { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .tx-row-amount { font-size: 18px; font-weight: 800; font-family: var(--font-headline); }
      `}</style>
    </>
  )
}
