'use client'

import { useState } from 'react'
import { X, Check, ArrowRight } from 'lucide-react'

interface AddFundsModalProps {
  isOpen: boolean
  onClose: () => void
  goalName: string
  onSave: (amount: number) => Promise<void>
}

export default function AddFundsModal({ isOpen, onClose, goalName, onSave }: AddFundsModalProps) {
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const isValid = amount && parseFloat(amount) > 0

  const handleSave = async () => {
    if (!isValid || saving) return
    setSaving(true)
    try {
      await onSave(parseFloat(amount))
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setAmount('')
        onClose()
      }, 800)
    } catch (error) {
      console.error(error)
      alert("Erreur lors de l'ajout des fonds")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet animate-slide-in-bottom">
        <div className="modal-handle" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Ajouter des fonds</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
            Combien souhaitez-vous ajouter à <strong style={{ color: 'var(--color-text-primary)' }}>{goalName}</strong> ?
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 'var(--space-sm)' }}>
            <input
              type="number"
              inputMode="numeric"
              style={{
                fontSize: 40, fontWeight: 800, background: 'transparent', border: 'none', outline: 'none',
                width: '180px', textAlign: 'center', color: 'var(--color-text-primary)'
              }}
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
            <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-tertiary)' }}>FCFA</span>
          </div>
        </div>

        <button 
          className={`btn btn-primary btn-lg ${saved ? 'saved' : ''}`} 
          style={{ width: '100%' }}
          onClick={handleSave}
          disabled={!isValid || saving}
        >
          {saved ? <><Check size={20} /> Ajouté !</> : saving ? 'Traitement...' : <><ArrowRight size={18} /> Confirmer l'ajout</>}
        </button>
      </div>
      
      <style jsx>{`
        .saved { background: var(--color-income) !important; }
      `}</style>
    </div>
  )
}
