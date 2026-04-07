'use client'

import { useState, useEffect } from 'react'
import { X, Wallet as WalletIcon, CreditCard, Building2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AddWalletModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
  onSave: (data: {
    name: string
    type: string
    balance: number
    icon: string
    color: string
  }, id?: string) => void
}

const WALLET_TYPES = [
  { id: 'cash', label: 'Espèces', icon: WalletIcon, color: '#10B981' },
  { id: 'bank', label: 'Compte Bancaire', icon: Building2, color: '#3B82F6' },
  { id: 'mobile_money', label: 'Mobile Money', icon: CreditCard, color: '#F59E0B' },
]

const ICONS = ['💰', '💳', '🏦', '📱', '💵', '🏠', '🚗']

export default function AddWalletModal({ isOpen, onClose, initialData, onSave }: AddWalletModalProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState('cash')
  const [balance, setBalance] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('💰')

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name)
      setType(initialData.type)
      setBalance(initialData.balance?.toString())
      setSelectedIcon(initialData.icon)
    } else if (isOpen) {
      setName('')
      setType('cash')
      setBalance('')
      setSelectedIcon('💰')
    }
  }, [isOpen, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const walletType = WALLET_TYPES.find(t => t.id === type)
    onSave({
      name,
      type,
      balance: parseFloat(balance) || 0,
      icon: selectedIcon,
      color: walletType?.color || '#10B981',
    }, initialData?.id)
    // Reset and close
    setName('')
    setBalance('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          className="modal-content"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="modal-title">{initialData ? 'Modifier le portefeuille' : 'Nouveau Portefeuille'}</h2>
            <button className="btn btn-icon btn-ghost" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label>Nom du portefeuille</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Ex: Salaire, Épargne, Wave..." 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Solde initial (FCFA)</label>
              <input 
                type="number" 
                className="input" 
                placeholder="0" 
                value={balance}
                onChange={e => setBalance(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Type de compte</label>
              <div className="wallet-type-grid">
                {WALLET_TYPES.map(t => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`wallet-type-card ${type === t.id ? 'active' : ''}`}
                      onClick={() => setType(t.id)}
                      style={{ '--accent': t.color } as any}
                    >
                      <Icon size={20} />
                      <span>{t.label}</span>
                      {type === t.id && <Check size={14} className="check-icon" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Icône</label>
              <div className="icon-grid">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-item ${selectedIcon === icon ? 'active' : ''}`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                Créer le portefeuille
              </button>
            </div>
          </form>
        </motion.div>

        <style jsx>{`
          .wallet-type-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-sm);
          }
          .wallet-type-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-xs);
            padding: var(--space-md) var(--space-xs);
            background: var(--color-bg);
            border: 2px solid transparent;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all var(--transition-fast);
            position: relative;
            color: var(--color-text-secondary);
            font-size: 10px;
            text-align: center;
          }
          .wallet-type-card.active {
            background: var(--color-surface);
            border-color: var(--accent);
            color: var(--color-text-primary);
          }
          :global(.check-icon) {
            position: absolute;
            top: 4px;
            right: 4px;
            color: var(--accent);
          }
          .icon-grid {
            display: flex;
            gap: var(--space-sm);
            flex-wrap: wrap;
          }
          .icon-item {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 20px;
          }
          .icon-item.active {
            border-color: var(--color-accent);
            background: var(--color-accent-light);
          }
          .modal-footer {
            display: flex;
            gap: var(--space-md);
            margin-top: var(--space-xl);
          }
        `}</style>
      </div>
    </AnimatePresence>
  )
}
