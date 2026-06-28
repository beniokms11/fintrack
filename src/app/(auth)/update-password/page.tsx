'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '../login/actions'
import { Lock, Loader2, CheckCircle2 } from 'lucide-react'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const pass = formData.get('password') as string
    const confirmPass = formData.get('confirm_password') as string

    if (pass !== confirmPass) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }
    
    try {
      const res = await updatePassword(formData)
      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 2500)
      }
    } catch (err) {
      console.error(err)
      setError("Une erreur est survenue lors de la mise à jour du mot de passe.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box animate-fade-in-up">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-icon">🔑</span>
            <h1>Nouveau mot de passe</h1>
          </div>
          <p className="login-subtitle">
            Choisissez un nouveau mot de passe sécurisé pour votre compte FinTrack.
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {success ? (
          <div className="success-card animate-fade-in">
            <CheckCircle2 size={48} className="success-icon" />
            <h3>Mot de passe modifié !</h3>
            <p>
              Votre mot de passe a été mis à jour avec succès. Redirection vers votre tableau de bord en cours...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  minLength={6}
                  className="input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Confirmer le mot de passe</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  id="confirm_password" 
                  name="confirm_password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  minLength={6}
                  className="input"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg login-btn"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
          background: radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.08) 0%, var(--color-bg) 70%);
        }
        .login-box {
          width: 100%;
          max-width: 420px;
          background: var(--color-surface);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-3xl) var(--space-xl);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }
        .login-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }
        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }
        .login-icon {
          font-size: 32px;
        }
        .login-logo h1 {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          background: linear-gradient(135deg, var(--color-text), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .login-subtitle {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          line-height: 1.5;
        }
        .login-error {
          background: var(--color-expense-light);
          color: var(--color-expense);
          padding: var(--space-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
          font-size: var(--font-size-sm);
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .success-card {
          text-align: center;
          padding: var(--space-md) 0;
        }
        .success-icon {
          color: var(--color-accent);
          margin: 0 auto var(--space-md);
        }
        .success-card h3 {
          font-size: var(--font-size-xl);
          font-weight: 700;
          margin-bottom: var(--space-sm);
        }
        .success-card p {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          line-height: 1.6;
        }
        .form-group {
          margin-bottom: var(--space-lg);
        }
        .form-group label {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: 600;
          margin-bottom: var(--space-xs);
          color: var(--color-text);
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: var(--space-md);
          color: var(--color-text-secondary);
          pointer-events: none;
        }
        .input {
          width: 100%;
          padding: var(--space-md) var(--space-md) var(--space-md) 42px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          color: var(--color-text);
          font-size: var(--font-size-md);
          transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
        .login-btn {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--space-sm);
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
        }
      `}</style>
    </div>
  )
}
