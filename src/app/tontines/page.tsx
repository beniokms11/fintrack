'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF, formatDate } from '@/lib/utils'
import { ArrowLeft, Plus, Users, Calendar, Coins, CheckCircle, Trash2, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface NewTontineForm {
  name: string
  contribution_amount: string
  frequency: 'weekly' | 'monthly'
  start_date: string
  members: string[]
}

export default function TontinesPage() {
  const { tontines, addTontine, payTontineRound, payoutTontine, deleteTontine } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTontine, setActiveTontine] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // New Tontine form state
  const [form, setForm] = useState<NewTontineForm>({
    name: '',
    contribution_amount: '',
    frequency: 'monthly',
    start_date: new Date().toISOString().slice(0, 10),
    members: ['', ''] // start with 2 members empty inputs
  })

  const handleAddMemberInput = () => {
    setForm(f => ({ ...f, members: [...f.members, ''] }))
  }

  const handleRemoveMemberInput = (index: number) => {
    setForm(f => ({ ...f, members: f.members.filter((_, i) => i !== index) }))
  }

  const handleMemberNameChange = (index: number, val: string) => {
    const nextMembers = [...form.members]
    nextMembers[index] = val
    setForm(f => ({ ...f, members: nextMembers }))
  }

  const handleSaveTontine = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate members
    const cleanMembers = form.members
      .map(m => m.trim())
      .filter(m => m !== '')
      .map((name, i) => ({
        name,
        draw_turn: i + 1
      }))

    if (cleanMembers.length < 2 || !form.name || !form.contribution_amount) {
      window.alert("Veuillez remplir tous les champs et ajouter au moins 2 participants.")
      return
    }

    await addTontine({
      name: form.name,
      contribution_amount: parseFloat(form.contribution_amount),
      frequency: form.frequency,
      start_date: form.start_date,
      members: cleanMembers
    })

    // Reset form
    setForm({
      name: '',
      contribution_amount: '',
      frequency: 'monthly',
      start_date: new Date().toISOString().slice(0, 10),
      members: ['', '']
    })
    
    setShowAddModal(false)
  }

  const handleOpenDetail = (t: any) => {
    setActiveTontine(t)
    setShowDetailModal(true)
  }

  const handleRecordPayment = async (memberId: string, roundNumber: number) => {
    if (!activeTontine) return
    await payTontineRound(activeTontine.id, memberId, roundNumber, activeTontine.contribution_amount)
    
    // Refresh active tontine instance to reflect updates in modal
    const updated = tontines.find((t: any) => t.id === activeTontine.id)
    if (updated) setActiveTontine(updated)
  }

  const handlePayout = async (memberId: string) => {
    if (!activeTontine) return
    const todayStr = new Date().toISOString().slice(0, 10)
    await payoutTontine(activeTontine.id, memberId, todayStr)
    
    const updated = tontines.find((t: any) => t.id === activeTontine.id)
    if (updated) setActiveTontine(updated)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tontine ?")) {
      await deleteTontine(id)
      if (activeTontine?.id === id) {
        setShowDetailModal(false)
        setActiveTontine(null)
      }
    }
  }

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Tontines</h1>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setShowAddModal(true)} id="btn-new-tontine">
            <Plus size={16} /> Créer
          </button>
        </header>

        <div className="page-content">
          {/* Introduction Card */}
          <div className="card intro-card">
            <div className="intro-icon"><Coins size={24} /></div>
            <div>
              <h2 className="intro-title">Épargne Collective (Tontine)</h2>
              <p className="intro-text">
                Gère tes cercles de tontine traditionnels ou familiaux. Planifie les tirages, enregistre les cotisations et suis la distribution de la caisse à chaque tour.
              </p>
            </div>
          </div>

          {/* List of Tontines */}
          <div className="tontines-list">
            {tontines.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Users size={28} /></div>
                <h3 className="empty-state-title">Aucune tontine active</h3>
                <p className="empty-state-text">Crée ton premier groupe de tontine pour commencer l&apos;épargne collective.</p>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  + Créer une tontine
                </button>
              </div>
            ) : (
              tontines.map(t => {
                const membersCount = t.members?.length || 0
                const potTotal = membersCount * t.contribution_amount
                
                // Calculate current round / drawing progress
                const completedPayouts = t.members?.filter(m => m.is_paid_out).length || 0
                const currentRound = Math.min(completedPayouts + 1, membersCount)

                return (
                  <div key={t.id} className="card tontine-card" onClick={() => handleOpenDetail(t)} id={`tontine-${t.id}`}>
                    <div className="tontine-card-header">
                      <div>
                        <h3 className="tontine-card-name">{t.name}</h3>
                        <span className="tontine-card-meta">
                          <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          {t.frequency === 'weekly' ? 'Chaque semaine' : 'Chaque mois'} • {membersCount} membres
                        </span>
                      </div>
                      <button className="btn btn-icon btn-ghost btn-danger-hover" onClick={(e) => handleDelete(t.id, e)}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="tontine-card-grid">
                      <div className="grid-item">
                        <span className="grid-label">Cotisation</span>
                        <span className="grid-value tabular-nums">{formatXOF(t.contribution_amount)}</span>
                      </div>
                      <div className="grid-item">
                        <span className="grid-label">Cagnotte Totale</span>
                        <span className="grid-value tabular-nums" style={{ color: 'var(--color-accent)' }}>{formatXOF(potTotal)}</span>
                      </div>
                      <div className="grid-item">
                        <span className="grid-label">Progression des tours</span>
                        <span className="grid-value">{currentRound} / {membersCount}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-container" style={{ marginTop: 'var(--space-md)' }}>
                      <div className="progress-bar" style={{ height: 6 }}>
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${(completedPayouts / membersCount) * 100}%` }}
                        />
                      </div>
                      <div className="progress-labels">
                        <span>{completedPayouts} servis</span>
                        <span>{membersCount - completedPayouts} restants</span>
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

      {/* 1. Add Tontine Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-sheet animate-slide-in-bottom">
            <div className="modal-handle" />
            <div className="modal-header">
              <h2 className="modal-title">Créer une tontine</h2>
              <button className="btn btn-icon btn-ghost" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTontine} className="tontine-form">
              <div className="form-group">
                <label className="atm-label">Nom du groupe de tontine</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: Tontine Les Amis, Tontine Famille"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="atm-label">Cotisation (FCFA)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="Montant"
                    value={form.contribution_amount}
                    onChange={(e) => setForm(f => ({ ...f, contribution_amount: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="atm-label">Fréquence</label>
                  <select
                    className="input select-input"
                    value={form.frequency}
                    onChange={(e: any) => setForm(f => ({ ...f, frequency: e.target.value }))}
                  >
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="atm-label">Date de démarrage</label>
                <input
                  type="date"
                  className="input"
                  value={form.start_date}
                  onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))}
                  required
                />
              </div>

              {/* Members input list */}
              <div className="form-group">
                <label className="atm-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Participants (dans l&apos;ordre du tirage)</span>
                  <button type="button" className="btn btn-sm btn-ghost" style={{ color: 'var(--color-accent)' }} onClick={handleAddMemberInput}>
                    + Ajouter
                  </button>
                </label>
                
                <div className="members-inputs">
                  {form.members.map((member, i) => (
                    <div key={i} className="member-input-row">
                      <span className="member-index">{i + 1}</span>
                      <input
                        type="text"
                        className="input"
                        placeholder={`Nom du participant ${i + 1}`}
                        value={member}
                        onChange={(e) => handleMemberNameChange(i, e.target.value)}
                        required={i < 2} // At least 2 members are required
                      />
                      {form.members.length > 2 && (
                        <button type="button" className="btn btn-icon btn-ghost" onClick={() => handleRemoveMemberInput(i)}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
                Créer la tontine
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Detail Tontine Modal */}
      {showDetailModal && activeTontine && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowDetailModal(false)}>
          <div className="modal-sheet detail-sheet animate-slide-in-bottom">
            <div className="modal-handle" />
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{activeTontine.name}</h2>
                <span className="modal-subtitle">
                  Cotisation : {formatXOF(activeTontine.contribution_amount)} • {activeTontine.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                </span>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => setShowDetailModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Member Round Progress tracker */}
              <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>Participants & Caisse</div>
              <div className="tontine-members-list">
                {activeTontine.members
                  ?.sort((a: any, b: any) => a.draw_turn - b.draw_turn)
                  .map((m: any) => {
                    const hasPayout = m.is_paid_out
                    
                    // Simple round calculation
                    // Round payments inside member
                    const roundPayments = m.payments || []
                    
                    return (
                      <div key={m.id} className={`member-detail-card ${hasPayout ? 'payout-served' : ''}`}>
                        <div className="member-detail-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                            <span className="member-turn">{m.draw_turn}</span>
                            <div>
                              <span className="member-name">{m.name}</span>
                              {hasPayout && (
                                <span className="member-payout-badge">
                                  Servi le {formatDate(m.payout_date, 'short')}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {!hasPayout && (
                            <button className="btn btn-sm btn-primary" onClick={() => handlePayout(m.id)}>
                              Bénéficier du pot
                            </button>
                          )}
                        </div>

                        {/* Payments checklist for current rounds */}
                        <div className="member-payment-section">
                          <span className="payment-label">Cotisations payées :</span>
                          <div className="payments-bubbles">
                            {activeTontine.members.map((_: any, idx: number) => {
                              const roundNum = idx + 1
                              const isPaid = roundPayments.some((p: any) => p.round_number === roundNum)
                              
                              return (
                                <button
                                  key={roundNum}
                                  className={`payment-bubble ${isPaid ? 'paid' : ''}`}
                                  disabled={isPaid}
                                  onClick={() => handleRecordPayment(m.id, roundNum)}
                                  title={isPaid ? `Payé pour le tour ${roundNum}` : `Marquer payé pour le tour ${roundNum}`}
                                >
                                  T{roundNum}
                                  {isPaid && <CheckCircle size={8} className="payment-bubble-check" />}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Tontine Info alert */}
              <div className="alert-card">
                <AlertCircle size={18} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
                <p className="alert-text">
                  Chaque participant cotise à chaque tour (T1, T2...). Cliquez sur une bulle de tour pour enregistrer la cotisation du membre. Un tour se termine quand tous les membres ont cotisé.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .intro-card { display: flex; gap: var(--space-md); padding: var(--space-lg) var(--space-md); background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-container-low) 100%); margin-bottom: var(--space-xl); border: 1px solid var(--color-border-light); }
        .intro-icon { width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--color-accent-light); color: var(--color-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .intro-title { font-size: var(--font-size-md); font-weight: 700; color: var(--color-text-primary); margin-bottom: 2px; }
        .intro-text { font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.4; }

        .tontines-list { display: flex; flex-direction: column; gap: var(--space-lg); }
        .tontine-card { cursor: pointer; transition: transform var(--transition-fast), box-shadow var(--transition-fast); }
        .tontine-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .tontine-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-md); }
        .tontine-card-name { font-size: var(--font-size-md); font-weight: 700; color: var(--color-text-primary); }
        .tontine-card-meta { font-size: var(--font-size-xs); color: var(--color-text-tertiary); display: block; margin-top: 2px; }

        :global(.btn-danger-hover:hover) { color: var(--color-expense) !important; background: var(--color-expense-light) !important; }

        .tontine-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm); border-top: 1px solid var(--color-border-light); border-bottom: 1px solid var(--color-border-light); padding: var(--space-md) 0; }
        .grid-item { display: flex; flex-direction: column; gap: 2px; }
        .grid-label { font-size: 10px; text-transform: uppercase; color: var(--color-text-tertiary); font-weight: 600; letter-spacing: 0.02em; }
        .grid-value { font-size: var(--font-size-base); font-weight: 700; color: var(--color-text-primary); }

        .progress-labels { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--color-text-tertiary); margin-top: 4px; }

        /* Form styling */
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
        .modal-title { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); }
        .modal-subtitle { font-size: var(--font-size-xs); color: var(--color-text-secondary); display: block; margin-top: 2px; }
        .tontine-form { display: flex; flex-direction: column; gap: var(--space-lg); }
        .form-row { display: flex; gap: var(--space-md); }
        .flex-1 { flex: 1; }
        .select-input { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 14px center; background-size: 14px; padding-right: 40px !important; }

        .members-inputs { display: flex; flex-direction: column; gap: var(--space-sm); max-height: 200px; overflow-y: auto; padding: 2px; }
        .member-input-row { display: flex; align-items: center; gap: var(--space-sm); }
        .member-index { width: 24px; height: 24px; border-radius: var(--radius-full); background: var(--color-surface-container); font-size: var(--font-size-xs); font-weight: 700; display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary); flex-shrink: 0; }

        /* Detail Modal styling */
        .detail-sheet { max-height: 95dvh !important; }
        .tontine-members-list { display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-xl); max-height: 50vh; overflow-y: auto; }
        .member-detail-card { padding: var(--space-md) var(--space-lg); background: var(--color-surface-container-low); border-radius: var(--radius-md); border: 1px solid var(--color-border-light); }
        .member-detail-card.payout-served { border-color: var(--color-accent-light); background: rgba(16, 185, 129, 0.03); }
        
        .member-detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); }
        .member-turn { width: 32px; height: 32px; border-radius: var(--radius-full); background: var(--color-accent-light); color: var(--color-accent); font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: var(--font-size-base); }
        .member-name { display: block; font-weight: 700; font-size: var(--font-size-base); color: var(--color-text-primary); }
        .member-payout-badge { display: inline-block; font-size: 10px; font-weight: 700; color: var(--color-accent); background: var(--color-accent-light); padding: 2px 6px; border-radius: 4px; margin-top: 2px; }
        
        .member-payment-section { display: flex; align-items: center; gap: var(--space-md); border-top: 1px dashed var(--color-border); padding-top: var(--space-sm); }
        .payment-label { font-size: var(--font-size-xs); color: var(--color-text-secondary); font-weight: 500; }
        .payments-bubbles { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
        
        .payment-bubble { position: relative; font-family: var(--font-headline); font-size: 10px; font-weight: 700; width: 28px; height: 28px; border-radius: var(--radius-full); border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast); }
        .payment-bubble:hover { border-color: var(--color-accent); color: var(--color-accent); }
        .payment-bubble.paid { background: var(--color-accent); border-color: var(--color-accent); color: white; cursor: default; }
        :global(.payment-bubble-check) { position: absolute; bottom: 2px; right: 2px; color: white; background: var(--color-accent); border-radius: 50%; }

        .alert-card { display: flex; gap: var(--space-sm); padding: var(--space-md) var(--space-lg); border-radius: var(--radius-md); background: var(--color-info-light); color: var(--color-info); border: 1px solid rgba(59, 130, 246, 0.15); margin-top: var(--space-lg); }
        .alert-text { font-size: var(--font-size-xs); line-height: 1.4; color: var(--color-text-primary); margin: 0; }
      `}</style>
    </>
  )
}
