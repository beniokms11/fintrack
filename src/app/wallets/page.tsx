'use client'

import { useState } from 'react'
import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF } from '@/lib/utils'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import AddWalletModal from '@/components/wallets/AddWalletModal'

export default function WalletsPage() {
  const { wallets, addWallet, updateWallet, deleteWallet } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<any>(null)
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
            onClick={() => { setEditingWallet(null); setShowModal(true); }}
          >
            <Plus size={16} /> Ajouter
          </button>
        </header>

        <div className="page-content">
          <div className="wallet-hero-card" id="wallets-total">
            <span className="whc-label">TOTAL NET WORTH</span>
            <span className="whc-balance tabular-nums">{formatXOF(total)}</span>
            <div className="whc-change positive">
              <ArrowLeft size={12} className="rotate-up" />
              +4.2% <span style={{ opacity: 0.7, fontWeight: 500, marginLeft: 4 }}>vs last month</span>
            </div>
            
            <button 
              className="btn btn-primary whc-add-btn" 
              onClick={() => { setEditingWallet(null); setShowModal(true); }}
              id="btn-new-wallet-hero"
            >
              <Plus size={18} /> Add New Wallet
            </button>
          </div>

          <div className="wallets-list">
            {wallets.map(wallet => (
              <div key={wallet.id} className="wallet-item-card" id={`wallet-${wallet.id}`}>
                <div className="wic-header">
                  <div className="wic-icon" style={{ background: `${wallet.color}15`, color: wallet.color }}>
                    {wallet.icon}
                  </div>
                  <div className="wic-info">
                    <span className="wic-name">{wallet.name}</span>
                    <span className="wic-type">{wallet.type.replace('_', ' ')}</span>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingWallet(wallet); setShowModal(true); }}
                      className="btn-icon btn-ghost" style={{ padding: '4px', color: 'var(--color-text-tertiary)' }}
                    ><Pencil size={16} /></button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(window.confirm('Supprimer ce compte ?')) deleteWallet(wallet.id) }}
                      className="btn-icon btn-ghost" style={{ padding: '4px', color: 'var(--color-expense)' }}
                    ><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="wic-body">
                  <span className="wic-label">Available Balance</span>
                  <span className="wic-amount tabular-nums">{formatXOF(wallet.balance)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .wallet-hero-card {
            background: var(--color-surface);
            border-radius: var(--radius-xl);
            padding: var(--space-2xl) var(--space-xl);
            box-shadow: var(--shadow-md);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: var(--space-2xl);
            margin-top: var(--space-md);
          }
          .whc-label {
            font-size: 11px;
            font-weight: 700;
            color: var(--color-text-tertiary);
            letter-spacing: 0.05em;
            margin-bottom: var(--space-sm);
          }
          .whc-balance {
            font-size: 40px;
            font-weight: 800;
            color: var(--color-text-primary);
            line-height: 1.1;
            letter-spacing: -0.03em;
            margin-bottom: var(--space-md);
          }
          .whc-change {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            border-radius: var(--radius-full);
            font-size: 12px;
            font-weight: 700;
            margin-bottom: var(--space-xl);
          }
          .whc-change.positive {
            background: var(--color-accent-light);
            color: var(--color-accent);
          }
          .rotate-up {
            transform: rotate(45deg);
            margin-right: 2px;
          }
          .whc-add-btn {
            width: 100%;
            border-radius: var(--radius-full);
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 8px 20px var(--color-accent-glow);
          }
          
          .wallets-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
            padding-bottom: 100px;
          }
          .wallet-item-card {
            background: var(--color-surface);
            border-radius: var(--radius-xl);
            padding: var(--space-xl);
            box-shadow: var(--shadow-sm);
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
          }
          .wic-header {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            padding-bottom: var(--space-md);
            border-bottom: 1px solid var(--color-border-light);
          }
          .wic-icon {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
          }
          .wic-info {
            display: flex;
            flex-direction: column;
          }
          .wic-name {
            font-size: 16px;
            font-weight: 700;
            color: var(--color-text-primary);
          }
          .wic-type {
            font-size: 12px;
            color: var(--color-text-tertiary);
            text-transform: capitalize;
          }
          .wic-body {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .wic-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--color-text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .wic-amount {
            font-size: 24px;
            font-weight: 800;
            color: var(--color-text-primary);
          }
        `}</style>
      </div>
      <BottomNav />
      <AddWalletModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        initialData={editingWallet}
        onSave={(data, id) => {
          if (id) updateWallet(id, data)
          else addWallet(data)
        }} 
      />
    </>
  )
}
