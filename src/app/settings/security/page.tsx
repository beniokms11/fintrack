'use client'

import { useState } from 'react'
import { ArrowLeft, Lock, Save, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/components/navigation/BottomNav'

export default function SecurityPage() {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' })
      return
    }

    setSaving(true)
    setMessage(null)
    
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès !' })
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error(err)
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/settings" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Sécurité</h1>
          </div>
        </header>

        <div className="page-content">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 'var(--radius-full)',
              background: 'var(--color-accent-light)', color: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-md)',
            }}>
              <ShieldCheck size={28} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Changer le mot de passe</h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Assure-toi d'utiliser un mot de passe robuste d'au moins 6 caractères.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {message && (
              <div style={{ 
                padding: 'var(--space-md)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--font-size-sm)',
                background: message.type === 'success' ? 'var(--color-income-light)' : 'var(--color-expense-light)',
                color: message.type === 'success' ? 'var(--color-income)' : 'var(--color-expense)',
                textAlign: 'center'
              }}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  className="input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  className="input" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ marginTop: 'var(--space-md)' }}
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Mettre à jour le mot de passe</>}
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
      <style jsx>{`
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .form-group label {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .input-with-icon {
          position: relative;
        }
        :global(.input-icon) {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-tertiary);
          pointer-events: none;
        }
        .input-with-icon .input {
          padding-left: 42px;
          width: 100%;
        }
      `}</style>
    </>
  )
}
