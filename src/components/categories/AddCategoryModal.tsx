'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../providers/AppProvider'

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (categoryId: string) => void
  defaultType?: 'income' | 'expense' | 'both'
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e']
const ICONS = ['🛒', '🚗', '🏠', '💡', '🏥', '🎉', '✈️', '📚', '👗', '🎮', '🍔', '🎁', '📱', '🏋️', '🐾', '💼', '📈', '💰', '💸']

export default function AddCategoryModal({ isOpen, onClose, onSuccess, defaultType = 'expense' }: AddCategoryModalProps) {
  const { addCategory } = useApp()
  const [name, setName] = useState('')
  const [type, setType] = useState(defaultType)
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0])
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    const newCat = await addCategory({
      name: name.trim(),
      type,
      icon: selectedIcon,
      color: selectedColor
    })
    setSaving(false)

    if (newCat) {
      if (onSuccess) onSuccess(newCat.id)
      setName('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
        <motion.div 
          className="modal-content"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="modal-title">Nouvelle Catégorie</h2>
            <button className="btn btn-icon btn-ghost" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label>Nom de la catégorie</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Ex: Streaming, Loisirs..." 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn ${type === 'expense' ? 'active' : ''}`}
                  onClick={() => setType('expense')}
                >
                  Dépense
                </button>
                <button
                  type="button"
                  className={`type-btn ${type === 'income' ? 'active' : ''}`}
                  onClick={() => setType('income')}
                >
                  Revenu
                </button>
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

            <div className="form-group">
              <label>Couleur</label>
              <div className="color-grid">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`color-item ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    style={{ background: color }}
                  >
                    {selectedColor === color && <Check size={14} color="white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: 'var(--space-2xl)' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving || !name.trim()}>
                {saving ? 'Création...' : 'Créer la catégorie'}
              </button>
            </div>
          </form>
        </motion.div>

        <style jsx>{`
          .type-toggle {
            display: flex;
            gap: var(--space-xs);
            background: var(--color-bg);
            border-radius: var(--radius-md);
            padding: 3px;
          }
          .type-btn {
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
          .type-btn.active {
            background: var(--color-surface);
            color: var(--color-accent);
            box-shadow: var(--shadow-sm);
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
          .color-grid {
            display: flex;
            gap: var(--space-sm);
            flex-wrap: wrap;
          }
          .color-item {
            width: 36px;
            height: 36px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
            transition: transform var(--transition-fast);
          }
          .color-item:hover {
            transform: scale(1.1);
          }
          .color-item.active {
            outline: 2px solid var(--color-text-primary);
            outline-offset: 2px;
          }
        `}</style>
      </div>
    </AnimatePresence>
  )
}
