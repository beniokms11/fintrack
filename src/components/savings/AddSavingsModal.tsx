'use client'

import { useState } from 'react'
import { X, Calendar, Check, Target } from 'lucide-react'
import { useApp } from '../providers/AppProvider'

interface AddSavingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (data: { name: string; target_amount: number; deadline: string; current_amount: number; icon: string; color: string }) => void
}

const PREDEFINED_ICONS = ['💰', '🚗', '🏠', '✈️', '💻', '🎓', '🏥', '🎉']
const PREDEFINED_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

export default function AddSavingsModal({ isOpen, onClose, onSave }: AddSavingsModalProps) {
  const [form, setForm] = useState({
    name: '',
    target_amount: '',
    deadline: '',
    icon: PREDEFINED_ICONS[0],
    color: '#3B82F6' // Default info blue
  })
  
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const isValid = form.name.trim() !== '' && form.target_amount && parseFloat(form.target_amount) > 0

  const handleSave = async () => {
    if (!isValid) return
    setSaving(true)

    // Simulate saving delay (real logic goes via AppProvider to Supabase)
    await new Promise(resolve => setTimeout(resolve, 500))

    setSaving(false)
    setSaved(true)

    if (onSave) {
      onSave({
        name: form.name.trim(),
        target_amount: parseFloat(form.target_amount),
        current_amount: 0,
        deadline: form.deadline || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        icon: form.icon,
        color: form.color
      })
    }

    setTimeout(() => {
      setSaved(false)
      setForm({
        name: '',
        target_amount: '',
        deadline: '',
        icon: PREDEFINED_ICONS[0],
        color: '#3B82F6'
      })
      onClose()
    }, 600)
  }

  const handleClose = () => {
    setForm({
      name: '',
      target_amount: '',
      deadline: '',
      icon: PREDEFINED_ICONS[0],
      color: '#3B82F6'
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-sheet animate-slide-in-bottom" id="add-savings-modal">
        {/* Handle */}
        <div className="modal-handle" />

        {/* Header */}
        <div className="atm-header">
          <h2 className="atm-title">Nouvel objectif</h2>
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
              value={form.target_amount}
              onChange={(e) => setForm(f => ({ ...f, target_amount: e.target.value }))}
              autoFocus
              id="input-savings-amount"
            />
            <span className="atm-amount-currency">FCFA</span>
          </div>
        </div>

        {/* Fields */}
        <div className="atm-fields">
          {/* Name */}
          <div className="atm-field">
            <label className="atm-label">Nom de l'objectif</label>
            <div className="atm-input-wrap">
              <input
                type="text"
                className="input"
                placeholder="Ex: Voiture, Voyage..."
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                id="input-savings-name"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="atm-field">
            <label className="atm-label">Date limite (Optionnel)</label>
            <div className="atm-input-wrap">
              <Calendar size={16} className="atm-input-icon" style={{ position: 'absolute', top: 14, left: 14, color: 'var(--color-text-tertiary)' }} />
              <input
                type="date"
                className="input atm-date-input"
                style={{ paddingLeft: 40 }}
                value={form.deadline}
                onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))}
                id="input-savings-date"
              />
            </div>
          </div>

          {/* Icon & Color (Simple configuration row) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="atm-field">
              <label className="atm-label">Icône</label>
              <div className="input" style={{ padding: '8px', display: 'flex', gap: '4px', overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                {PREDEFINED_ICONS.map(i => (
                  <button 
                    key={i} 
                    style={{ fontSize: 20, padding: 4, background: form.icon === i ? 'var(--color-surface-hover)' : 'transparent', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    onClick={() => setForm(f => ({ ...f, icon: i }))}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="atm-field">
              <label className="atm-label">Couleur</label>
              <div className="input" style={{ padding: '8px', display: 'flex', gap: '4px', overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                {PREDEFINED_COLORS.map(c => (
                  <button 
                    key={c} 
                    style={{ 
                      width: 24, height: 24, borderRadius: '50%', background: c, border: form.color === c ? '2px solid var(--color-text-primary)' : '2px solid transparent', cursor: 'pointer', flexShrink: 0
                    }}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="atm-actions">
          <button
            className={`btn btn-primary btn-lg atm-save-btn ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={!isValid || saving}
            id="btn-save-savings"
          >
            {saved ? (
              <><Check size={20} /> Créé !</>
            ) : saving ? (
              'Création...'
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18} /> Lancer l'objectif</span>
            )}
          </button>
        </div>

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
          .atm-input-wrap {
            position: relative;
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
