'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Clock, Plus, PieChart, MoreHorizontal } from 'lucide-react'
import { useApp } from '@/components/providers/AppProvider'
import { useState } from 'react'
import AddTransactionModal from '@/components/transactions/AddTransactionModal'

const navItems = [
  { key: 'home', label: 'Accueil', href: '/', icon: Home },
  { key: 'history', label: 'Historique', href: '/transactions', icon: Clock },
  { key: 'add', label: '', href: '#add', icon: Plus },
  { key: 'budgets', label: 'Budgets', href: '/budgets', icon: PieChart },
  { key: 'more', label: 'Plus', href: '/more', icon: MoreHorizontal },
]

interface BottomNavProps {
  onAddClick?: () => void
}

export default function BottomNav({ onAddClick }: BottomNavProps) {
  const pathname = usePathname()
  const { addTransaction } = useApp()
  const [showModal, setShowModal] = useState(false)

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick()
    } else {
      setShowModal(true)
    }
  }

  return (
    <>
      <nav className="nav-bottom" id="bottom-nav">
      {navItems.map(item => {
        if (item.key === 'add') {
          return (
            <button
              key={item.key}
              className="nav-fab"
              onClick={handleAddClick}
              aria-label="Ajouter une transaction"
              id="btn-add-transaction"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          )
        }

        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`nav-item ${isActive ? 'active' : ''}`}
            id={`nav-${item.key}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label}</span>
          </Link>
        )
      })}
      </nav>
      {/* Fallback global add modal if not managed by parent */}
      {!onAddClick && (
        <AddTransactionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={(data) => addTransaction({ ...data, amount: parseFloat(data.amount) })}
        />
      )}
    </>
  )
}
