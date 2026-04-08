'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, Calendar, Plus, Check } from 'lucide-react'
import { TransactionType } from '@/lib/types'
import { useApp } from '../providers/AppProvider'
import AddCategoryModal from '../categories/AddCategoryModal'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (data: TransactionFormState, id?: string) => void
  initialData?: any
}

interface TransactionFormState {
  type: TransactionType
  amount: string
  category_id: string
  wallet_id: string
  date: string
  description: string
  merchant: string
}

export default function AddTransactionModal({ isOpen, onClose, onSave, initialData }: AddTransactionModalProps) {
  const { categories: appCategories, wallets: appWallets } = useApp()
  const [form, setForm] = useState<TransactionFormState>({
    type: 'expense',
    amount: '',
    category_id: '',
    wallet_id: appWallets[0]?.id || '',
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
    description: '',
    merchant: '',
  })
  const [showCategories, setShowCategories] = useState(false)
  const [showWallets, setShowWallets] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        type: initialData.type || 'expense',
        amount: initialData.amount ? String(initialData.amount) : '',
        category_id: initialData.category_id || '',
        wallet_id: initialData.wallet_id || appWallets[0]?.id || '',
        date: initialData.date || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
        description: initialData.description || '',
        merchant: initialData.merchant || '',
      })
    } else if (isOpen && !initialData) {
      setForm({
        type: 'expense',
        amount: '',
        category_id: '',
        wallet_id: appWallets[0]?.id || '',
        date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
        description: '',
        merchant: '',
      })
    }
  }, [isOpen, initialData, appWallets])

  if (!isOpen) return null

  const categories = appCategories.filter(c =>
    c.type === form.type || c.type === 'both'
  )

  const selectedCategory = appCategories.find(c => c.id === form.category_id)
  const selectedWallet = appWallets.find(w => w.id === form.wallet_id)

  const isValid = form.amount && parseFloat(form.amount) > 0 && form.category_id && form.wallet_id

  const handleSave = async (addAnother: boolean) => {
    if (!isValid) return
    setSaving(true)

    // Simulate saving (will connect to Supabase later)
    await new Promise(resolve => setTimeout(resolve, 500))

    setSaving(false)
    setSaved(true)

    if (onSave) {
      onSave(form, initialData?.id)
    }

    setTimeout(() => {
      setSaved(false)
      if (addAnother) {
        setForm(f => ({ ...f, amount: '', description: '', merchant: '' }))
      } else {
        setForm({
          type: 'expense',
          amount: '',
          category_id: '',
          wallet_id: appWallets[0]?.id || '',
          date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
          description: '',
          merchant: '',
        })
        onClose()
      }
    }, 600)
  }

  const handleClose = () => {
    setForm({
      type: 'expense',
      amount: '',
      category_id: '',
      wallet_id: appWallets[0]?.id || '',
      date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
      description: '',
      merchant: '',
    })
    setShowCategories(false)
    setShowWallets(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-sheet animate-slide-in-bottom" id="add-transaction-modal">
        {/* Handle */}
        <div className="modal-handle" />

        {/* Header */}
        <div className="atm-header">
          <h2 className="atm-title">{initialData ? 'Modifier transaction' : 'Nouvelle transaction'}</h2>
          <button className="btn btn-icon btn-ghost" onClick={handleClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="atm-type-toggle" id="type-toggle">
          <button
            className={`atm-type-btn ${form.type === 'expense' ? 'active expense' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'expense', category_id: '' }))}
          >
            Dépense
          </button>
          <button
            className={`atm-type-btn ${form.type === 'income' ? 'active income' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'income', category_id: '' }))}
          >
            Revenu
          </button>
        </div>

        {/* Amount Input */}
        <div className="atm-amount-section">
          <div className="atm-amount-wrap">
            <input
              type="number"
              inputMode="numeric"
              className="atm-amount-input"
              placeholder="0"
              value={form.amount}
              onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
              autoFocus
              id="input-amount"
            />
            <span className="atm-amount-currency">FCFA</span>
          </div>
        </div>

        {/* Fields */}
        <div className="atm-fields">
          {/* Category Picker */}
          <div className="atm-field">
            <label className="atm-label">Catégorie</label>
            <button
              className="atm-select"
              onClick={() => { setShowCategories(!showCategories); setShowWallets(false) }}
              id="select-category"
            >
              {selectedCategory ? (
                <span className="atm-select-value">
                  <span className="atm-select-icon">{selectedCategory.icon}</span>
                  {selectedCategory.name}
                </span>
              ) : (
                <span className="atm-select-placeholder">Choisir une catégorie</span>
              )}
              <ChevronDown size={16} />
            </button>
            {showCategories && (
              <div className="atm-picker" id="category-picker">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`atm-picker-item ${form.category_id === cat.id ? 'selected' : ''}`}
                    onClick={() => { setForm(f => ({ ...f, category_id: cat.id })); setShowCategories(false) }}
                  >
                    <span className="atm-picker-icon" style={{ background: `${cat.color}15` }}>{cat.icon}</span>
                    <span className="atm-picker-name">{cat.name}</span>
                    {form.category_id === cat.id && <Check size={16} style={{ color: 'var(--color-accent)' }} />}
                  </button>
                ))}
                <button
                  type="button"
                  className="atm-picker-item add-new-item"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCategories(false);
                    setShowAddCategoryModal(true);
                  }}
                  style={{ color: 'var(--color-accent)', fontWeight: 600, justifyContent: 'center' }}
                >
                  <Plus size={16} /> Ajouter une catégorie personnalisée
                </button>
              </div>
            )}
          </div>

          {/* Wallet Picker */}
          <div className="atm-field">
            <label className="atm-label">Portefeuille</label>
            <button
              className="atm-select"
              onClick={() => { setShowWallets(!showWallets); setShowCategories(false) }}
              id="select-wallet"
            >
              {selectedWallet ? (
                <span className="atm-select-value">
                  <span className="atm-select-icon">{selectedWallet.icon}</span>
                  {selectedWallet.name}
                </span>
              ) : (
                <span className="atm-select-placeholder">Choisir un portefeuille</span>
              )}
              <ChevronDown size={16} />
            </button>
            {showWallets && (
              <div className="atm-picker" id="wallet-picker">
                {appWallets.map(wallet => (
                  <button
                    key={wallet.id}
                    className={`atm-picker-item ${form.wallet_id === wallet.id ? 'selected' : ''}`}
                    onClick={() => { setForm(f => ({ ...f, wallet_id: wallet.id })); setShowWallets(false) }}
                  >
                    <span className="atm-picker-icon" style={{ background: `${wallet.color}15` }}>{wallet.icon}</span>
                    <span className="atm-picker-name">{wallet.name}</span>
                    {form.wallet_id === wallet.id && <Check size={16} style={{ color: 'var(--color-accent)' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="atm-field">
            <label className="atm-label">Date</label>
            <div className="atm-input-wrap">
              <Calendar size={16} className="atm-input-icon" />
              <input
                type="date"
                className="input atm-date-input"
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                id="input-date"
              />
            </div>
          </div>

          {/* Description */}
          <div className="atm-field">
            <label className="atm-label">Description</label>
            <input
              type="text"
              className="input"
              placeholder="Ex: Déjeuner au maquis"
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              id="input-description"
            />
          </div>

          {/* Merchant (optional) */}
          <div className="atm-field">
            <label className="atm-label">Marchand / source <span className="atm-optional">(optionnel)</span></label>
            <input
              type="text"
              className="input"
              placeholder="Ex: Chez Tantie, MTN, Entreprise SA"
              value={form.merchant}
              onChange={(e) => setForm(f => ({ ...f, merchant: e.target.value }))}
              id="input-merchant"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="atm-actions">
          <button
            className={`btn btn-primary btn-lg atm-save-btn ${saved ? 'saved' : ''}`}
            onClick={() => handleSave(false)}
            disabled={!isValid || saving}
            id="btn-save-transaction"
          >
            {saved ? (
              <><Check size={20} /> Enregistré !</>
            ) : saving ? (
              'Enregistrement...'
            ) : (
              'Enregistrer'
            )}
          </button>
          {!initialData && (
            <button
              className="btn btn-secondary atm-save-another"
              onClick={() => handleSave(true)}
              disabled={!isValid || saving}
              id="btn-save-and-add"
            >
              <Plus size={16} /> Enregistrer et ajouter
            </button>
          )}
        </div>

        {/* Nested Add Category Modal */}
        <AddCategoryModal
          isOpen={showAddCategoryModal}
          onClose={() => setShowAddCategoryModal(false)}
          defaultType={form.type}
          onSuccess={(catId) => {
            setForm(f => ({ ...f, category_id: catId }))
            setShowAddCategoryModal(false)
          }}
        />

        <style jsx>{`
          .atm-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--space-xl);
          }
          .atm-title {
            font-size: var(--font-size-lg);
            font-weight: 700;
          }
          .atm-type-toggle {
            display: flex;
            gap: var(--space-xs);
            background: var(--color-bg);
            border-radius: var(--radius-md);
            padding: 3px;
            margin-bottom: var(--space-xl);
          }
          .atm-type-btn {
            flex: 1;
            padding: var(--space-md);
            font-family: var(--font-family);
            font-size: var(--font-size-base);
            font-weight: 600;
            color: var(--color-text-tertiary);
            background: transparent;
            border: none;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .atm-type-btn.active.expense {
            background: var(--color-expense-light);
            color: var(--color-expense);
          }
          .atm-type-btn.active.income {
            background: var(--color-accent-light);
            color: var(--color-accent);
          }
          .atm-amount-section {
            text-align: center;
            margin-bottom: var(--space-2xl);
          }
          .atm-amount-wrap {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: var(--space-sm);
          }
          .atm-amount-input {
            font-family: var(--font-family);
            font-size: 48px;
            font-weight: 800;
            color: var(--color-text-primary);
            background: transparent;
            border: none;
            outline: none;
            text-align: center;
            width: 200px;
            letter-spacing: -0.03em;
            -moz-appearance: textfield;
          }
          .atm-amount-input::-webkit-outer-spin-button,
          .atm-amount-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .atm-amount-input::placeholder {
            color: var(--color-text-tertiary);
          }
          .atm-amount-currency {
            font-size: var(--font-size-lg);
            font-weight: 500;
            color: var(--color-text-tertiary);
          }
          .atm-fields {
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
            margin-bottom: var(--space-2xl);
          }
          .atm-field {
            position: relative;
          }
          .atm-label {
            display: block;
            font-size: var(--font-size-sm);
            font-weight: 500;
            color: var(--color-text-secondary);
            margin-bottom: var(--space-xs);
          }
          .atm-optional {
            font-weight: 400;
            color: var(--color-text-tertiary);
          }
          .atm-select {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--space-md) var(--space-lg);
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            font-family: var(--font-family);
            font-size: var(--font-size-base);
            color: var(--color-text-primary);
            cursor: pointer;
            transition: border-color var(--transition-fast);
          }
          .atm-select:hover {
            border-color: var(--color-accent);
          }
          .atm-select-value {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
          }
          .atm-select-icon {
            font-size: 18px;
          }
          .atm-select-placeholder {
            color: var(--color-text-tertiary);
          }
          .atm-picker {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 10;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            margin-top: var(--space-xs);
            max-height: 220px;
            overflow-y: auto;
            box-shadow: var(--shadow-lg);
            animation: slideUp 0.15s ease;
          }
          .atm-picker-item {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            width: 100%;
            padding: var(--space-md) var(--space-lg);
            background: transparent;
            border: none;
            border-bottom: 1px solid var(--color-border-light);
            font-family: var(--font-family);
            font-size: var(--font-size-base);
            color: var(--color-text-primary);
            cursor: pointer;
            transition: background var(--transition-fast);
            text-align: left;
          }
          .atm-picker-item:last-child {
            border-bottom: none;
          }
          .atm-picker-item:hover,
          .atm-picker-item.selected {
            background: var(--color-surface-hover);
          }
          .atm-picker-icon {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
          }
          .atm-picker-name {
            flex: 1;
          }
          .atm-input-wrap {
            position: relative;
          }
          :global(.atm-input-icon) {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-text-tertiary);
            pointer-events: none;
          }
          .atm-date-input {
            padding-left: 40px !important;
          }
          .atm-actions {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
          }
          .atm-save-btn {
            width: 100%;
            font-size: var(--font-size-md) !important;
            padding: var(--space-lg) !important;
          }
          .atm-save-btn.saved {
            background: var(--color-accent) !important;
          }
          .atm-save-another {
            width: 100%;
          }
        `}</style>
      </div>
    </div>
  )
}
