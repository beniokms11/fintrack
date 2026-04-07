'use client'

import { useState } from 'react'
import { X, ChevronDown, Check, Plus } from 'lucide-react'
import { useApp } from '../providers/AppProvider'
import AddCategoryModal from '../categories/AddCategoryModal'

interface AddBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (data: { category_id: string; amount: number; period: string }) => void
}

export default function AddBudgetModal({ isOpen, onClose, onSave }: AddBudgetModalProps) {
  const { categories: appCategories } = useApp()
  // Filter only categories that can be treated as expenses for budgets
  const expenseCategories = appCategories.filter(c => c.type === 'expense' || c.type === 'both')
  
  const [form, setForm] = useState({
    category_id: expenseCategories[0]?.id || '',
    amount: '',
    period: 'monthly'
  })
  
  const [showCategories, setShowCategories] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const selectedCategory = expenseCategories.find(c => c.id === form.category_id)

  const isValid = form.amount && parseFloat(form.amount) > 0 && form.category_id

  const handleSave = async () => {
    if (!isValid) return
    setSaving(true)

    // Simulate saving (actual logic will connect to Supabase via AppProvider)
    await new Promise(resolve => setTimeout(resolve, 500))

    setSaving(false)
    setSaved(true)

    if (onSave) {
      onSave({
        category_id: form.category_id,
        amount: parseFloat(form.amount),
        period: form.period
      })
    }

    setTimeout(() => {
      setSaved(false)
      setForm({
        category_id: expenseCategories[0]?.id || '',
        amount: '',
        period: 'monthly'
      })
      onClose()
    }, 600)
  }

  const handleClose = () => {
    setForm({
      category_id: expenseCategories[0]?.id || '',
      amount: '',
      period: 'monthly'
    })
    setShowCategories(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-sheet animate-slide-in-bottom" id="add-budget-modal">
        {/* Handle */}
        <div className="modal-handle" />

        {/* Header */}
        <div className="atm-header">
          <h2 className="atm-title">Nouveau budget</h2>
          <button className="btn btn-icon btn-ghost" onClick={handleClose} aria-label="Fermer">
            <X size={20} />
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
              id="input-budget-amount"
            />
            <span className="atm-amount-currency">FCFA</span>
          </div>
        </div>

        {/* Fields */}
        <div className="atm-fields">
          {/* Category Picker */}
          <div className="atm-field">
            <label className="atm-label">Catégorie cible</label>
            <button
              className="atm-select"
              onClick={() => setShowCategories(!showCategories)}
              id="select-budget-category"
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
              <div className="atm-picker" id="budget-category-picker">
                {expenseCategories.map(cat => (
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

          {/* Period Toggle */}
          <div className="atm-field">
            <label className="atm-label">Période</label>
            <div className="atm-type-toggle" style={{ marginBottom: 0 }}>
              <button
                className={`atm-type-btn ${form.period === 'weekly' ? 'active expense' : ''}`}
                onClick={() => setForm(f => ({ ...f, period: 'weekly' }))}
              >
                Hebdomadaire
              </button>
              <button
                className={`atm-type-btn ${form.period === 'monthly' ? 'active expense' : ''}`}
                onClick={() => setForm(f => ({ ...f, period: 'monthly' }))}
              >
                Mensuel
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="atm-actions">
          <button
            className={`btn btn-primary btn-lg atm-save-btn ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={!isValid || saving}
            id="btn-save-budget"
          >
            {saved ? (
              <><Check size={20} /> Enregistré !</>
            ) : saving ? (
              'Enregistrement...'
            ) : (
              'Définir le budget'
            )}
          </button>
        </div>

        {/* Nested Add Category Modal */}
        <AddCategoryModal
          isOpen={showAddCategoryModal}
          onClose={() => setShowAddCategoryModal(false)}
          defaultType="expense"
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
            background: var(--color-surface-hover);
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
        `}</style>
      </div>
    </div>
  )
}
