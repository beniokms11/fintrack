'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF, formatDate } from '@/lib/utils'
import { ArrowLeft, Clock, Trash2, ToggleLeft, ToggleRight, Calendar, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function RecurringTransactionsPage() {
  const { 
    recurringTransactions, 
    deleteRecurringTransaction, 
    toggleRecurringTransaction,
    categories,
    wallets
  } = useApp()

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleRecurringTransaction(id, !currentStatus)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette règle de récurrence ? Les transactions déjà générées ne seront pas supprimées.")) {
      await deleteRecurringTransaction(id)
    }
  }

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Transactions Récurrentes</h1>
          </div>
        </header>

        <div className="page-content">
          {/* Info banner */}
          <div className="card info-banner">
            <div className="info-icon"><Clock size={20} /></div>
            <div>
              <h2 className="info-title">Planification Automatique</h2>
              <p className="info-text">
                Les transactions récurrentes s&apos;exécutent automatiquement à la fréquence choisie (chaque jour, semaine, mois ou an). Elles mettent à jour tes soldes à leur date d&apos;échéance.
              </p>
            </div>
          </div>

          {/* Rules List */}
          <div className="rules-list">
            {recurringTransactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Clock size={28} /></div>
                <h3 className="empty-state-title">Aucune récurrence active</h3>
                <p className="empty-state-text">
                  Tu peux planifier des transactions automatiques en activant l&apos;option de récurrence lors de l&apos;ajout d&apos;une transaction.
                </p>
                <Link href="/" className="btn btn-primary">
                  + Nouvelle Transaction
                </Link>
              </div>
            ) : (
              recurringTransactions.map(rec => {
                const cat = categories.find(c => c.id === rec.category_id)
                const wallet = wallets.find(w => w.id === rec.wallet_id)

                let freqLabel = 'Chaque mois'
                if (rec.frequency === 'daily') freqLabel = 'Chaque jour'
                else if (rec.frequency === 'weekly') freqLabel = 'Chaque semaine'
                else if (rec.frequency === 'yearly') freqLabel = 'Chaque année'

                return (
                  <div key={rec.id} className={`card rule-card ${!rec.is_active ? 'rule-paused' : ''}`} id={`rule-${rec.id}`}>
                    <div className="rule-header">
                      <div className="rule-desc-section">
                        <div className="rule-category-icon" style={{ background: `${cat?.color || '#ECEEF2'}15` }}>
                          {cat?.icon || '💰'}
                        </div>
                        <div>
                          <h3 className="rule-title">{rec.description || cat?.name || 'Transaction récurrente'}</h3>
                          <span className="rule-wallet-name">
                            {wallet?.name || 'Portefeuille'} • {freqLabel}
                          </span>
                        </div>
                      </div>
                      <div className="rule-actions">
                        <button 
                          className="btn btn-icon btn-ghost toggle-btn" 
                          onClick={() => handleToggle(rec.id, rec.is_active)}
                          title={rec.is_active ? "Suspendre la récurrence" : "Activer la récurrence"}
                        >
                          {rec.is_active ? (
                            <ToggleRight size={28} style={{ color: 'var(--color-accent)' }} />
                          ) : (
                            <ToggleLeft size={28} style={{ color: 'var(--color-text-tertiary)' }} />
                          )}
                        </button>
                        <button 
                          className="btn btn-icon btn-ghost btn-danger-hover" 
                          onClick={() => handleDelete(rec.id)}
                          title="Supprimer la règle"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="rule-footer">
                      <div className="rule-amount tabular-nums" style={{ color: rec.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)' }}>
                        {rec.type === 'income' ? '+' : '-'}{formatXOF(rec.amount)}
                      </div>
                      <div className="rule-next-date">
                        <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        Début : {formatDate(rec.start_date, 'short')}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <BottomNav />

      <style jsx>{`
        .info-banner { display: flex; gap: var(--space-md); padding: var(--space-lg) var(--space-md); background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-container-low) 100%); margin-bottom: var(--space-xl); border: 1px solid var(--color-border-light); }
        .info-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--color-accent-light); color: var(--color-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .info-title { font-size: var(--font-size-md); font-weight: 700; color: var(--color-text-primary); margin-bottom: 2px; }
        .info-text { font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.4; }

        .rules-list { display: flex; flex-direction: column; gap: var(--space-md); }
        .rule-card { transition: all var(--transition-fast); }
        .rule-paused { opacity: 0.65; background: var(--color-surface-container-low); }
        .rule-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); }
        
        .rule-desc-section { display: flex; align-items: center; gap: var(--space-md); }
        .rule-category-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .rule-title { font-size: var(--font-size-base); font-weight: 700; color: var(--color-text-primary); }
        .rule-wallet-name { font-size: var(--font-size-xs); color: var(--color-text-tertiary); display: block; margin-top: 2px; }
        
        .rule-actions { display: flex; align-items: center; gap: var(--space-xs); }
        .toggle-btn { width: 44px; }
        :global(.btn-danger-hover:hover) { color: var(--color-expense) !important; background: var(--color-expense-light) !important; }

        .rule-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--color-border); padding-top: var(--space-sm); }
        .rule-amount { font-size: var(--font-size-md); font-weight: 800; }
        .rule-next-date { font-size: var(--font-size-xs); color: var(--color-text-tertiary); font-weight: 500; }
      `}</style>
    </>
  )
}
