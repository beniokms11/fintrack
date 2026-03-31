'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF, formatDate } from '@/lib/utils'
import { ArrowLeft, Plus, Target } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import AddSavingsModal from '@/components/savings/AddSavingsModal'
import AddFundsModal from '@/components/savings/AddFundsModal'

export default function SavingsPage() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoalAmount } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeGoal, setActiveGoal] = useState<any>(null)
  const [showFundsModal, setShowFundsModal] = useState(false)
  
  const totalSaved = savingsGoals.reduce((sum, g) => sum + Number(g.current_amount || 0), 0)
  const totalTarget = savingsGoals.reduce((sum, g) => sum + Number(g.target_amount || 0), 0)

  const handleAddFundsClick = (goal: any) => {
    setActiveGoal(goal)
    setShowFundsModal(true)
  }

  const handleSaveFunds = async (amount: number) => {
    if (!activeGoal) return
    await updateSavingsGoalAmount(activeGoal.id, amount)
  }

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Objectifs d&apos;épargne</h1>
          </div>
          <button className="btn btn-sm btn-primary" id="btn-new-goal" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Nouveau
          </button>
        </header>

        <div className="page-content">
          {/* Summary */}
          <div className="card" id="savings-total">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Target size={18} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Épargne totale</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="tabular-nums" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{formatXOF(totalSaved)}</span>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>/ {formatXOF(totalTarget)}</span>
            </div>
            <div className="progress-bar" style={{ height: 8, marginTop: 12 }}>
              <div className="progress-bar-fill" style={{ width: `${totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%` }} />
            </div>
          </div>

          {/* Goals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {savingsGoals.map(goal => {
              const pct = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0
              return (
                <div key={goal.id} className="card" id={`goal-${goal.id}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 'var(--radius-md)',
                      background: `${goal.color}15`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 24
                    }}>
                      {goal.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{goal.name}</span>
                      {goal.deadline && (
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                          Échéance : {formatDate(goal.deadline, 'short')}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-accent)' }}>
                      {Math.round(pct * 100)}%
                    </span>
                  </div>

                  <div className="progress-bar" style={{ height: 8, marginBottom: 8 }}>
                    <div className="progress-bar-fill" style={{ width: `${Math.min(pct * 100, 100)}%`, background: goal.color }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="tabular-nums" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {formatXOF(goal.current_amount)}
                    </span>
                    <span className="tabular-nums" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                      {formatXOF(goal.target_amount)}
                    </span>
                  </div>

                  <button 
                    className="btn btn-sm btn-secondary" 
                    style={{ width: '100%', marginTop: 'var(--space-md)' }}
                    onClick={() => handleAddFundsClick(goal)}
                  >
                    + Ajouter des fonds
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <BottomNav />
      <AddSavingsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={async (data) => {
          await addSavingsGoal(data)
          setShowAddModal(false)
        }}
      />
      {activeGoal && (
        <AddFundsModal
          isOpen={showFundsModal}
          onClose={() => setShowFundsModal(false)}
          goalName={activeGoal.name}
          onSave={handleSaveFunds}
        />
      )}
    </>
  )
}
