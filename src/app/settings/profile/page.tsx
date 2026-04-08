'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, User, Mail, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useApp } from '@/components/providers/AppProvider'
import BottomNav from '@/components/navigation/BottomNav'

export default function ProfilePage() {
  const supabase = createClient()
  const { updateProfile } = useApp()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
        if (profile) setFullName(profile.full_name || '')
      }
      setLoading(false)
    }
    getUser()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = fullName.trim()
    
    if (trimmedName.length < 2) {
      setMessage({ type: 'error', text: 'Ton nom doit contenir au moins 2 caractères.' })
      return
    }

    setSaving(true)
    setMessage(null)
    
    try {
      await updateProfile({ full_name: trimmedName })
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })
    } catch (err: any) {
      console.error(err)
      setMessage({ type: 'error', text: `Erreur: ${err.message || 'Impossible de mettre à jour'}` })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-accent)' }} />
    </div>
  )

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/settings" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Mon Profil</h1>
          </div>
        </header>

        <div className="page-content">
          <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
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
              <label>Adresse Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="input" 
                  value={user?.email || ''} 
                  disabled 
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                L'email ne peut pas être modifié pour le moment.
              </p>
            </div>

            <div className="form-group">
              <label>Nom complet</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Ton nom" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ marginTop: 'var(--space-md)' }}
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Enregistrer les modifications</>}
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
