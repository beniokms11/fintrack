'use client'

import { useState } from 'react'
import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF } from '@/lib/utils'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import AddWalletModal from '@/components/wallets/AddWalletModal'

export default function WalletsPage() {
  const { wallets, addWallet } = useApp()
  const [showModal, setShowModal] = useState(false)
  const total = wallets.reduce((sum, w) => sum + Number(w.balance), 0)

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Portefeuilles</h1>
          </div>
          <button 
            className="btn btn-sm btn-primary" 
            id="btn-new-wallet"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Ajouter
          </button>
        </header>

        <div className="page-content">
          <div className="card" id="wallets-total">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'block' }}>Solde total</span>
            <span className="tabular-nums" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{formatXOF(total)}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {wallets.map(wallet => (
              <div key={wallet.id} className="card" id={`wallet-${wallet.id}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: `${wallet.color}15`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 24, flexShrink: 0
                }}>
                  {wallet.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{wallet.name}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', textTransform: 'capitalize' }}>
                    {wallet.type.replace('_', ' ')}
                  </span>
                </div>
                <span className="tabular-nums" style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>{formatXOF(wallet.balance)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
      <AddWalletModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={addWallet} 
      />
    </>
  )
}
