'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, signup } from './actions'
import { Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      if (isLogin) {
        const res = await login(formData)
        if (res?.error) {
          setError(res.error)
          setLoading(false)
        } else if (res?.success) {
          router.push('/')
        }
      } else {
        const res = await signup(formData)
        if (res?.error) {
          setError(res.error)
          setLoading(false)
        } else if (res?.success) {
          router.push('/')
        }
      }
    } catch (err) {
      console.error(err)
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box animate-fade-in-up">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-icon">📊</span>
            <h1>FinTrack</h1>
          </div>
          <p className="login-subtitle">
            {isLogin ? 'Bon retour ! Connecte-toi pour continuer.' : 'Crée un compte pour suivre tes finances.'}
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="ton@email.com" 
                required 
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="input"
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg login-btn"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Tu n'as pas de compte ?" : "Tu as déjà un compte ?"}
            <button 
              type="button" 
              className="login-toggle" 
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
          background: var(--color-bg);
        }
        .login-box {
          width: 100%;
          max-width: 400px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-2xl) var(--space-xl);
          box-shadow: var(--shadow-lg);
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
          letter-spacing: -0.03em;
        }
        .login-subtitle {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
        .login-error {
          background: var(--color-expense-light);
          color: var(--color-expense);
          padding: var(--space-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
          font-size: var(--font-size-sm);
          font-weight: 500;
          text-align: center;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }
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
        .login-btn {
          width: 100%;
          margin-top: var(--space-md);
        }
        .login-footer {
          margin-top: var(--space-xl);
          text-align: center;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
        .login-toggle {
          background: none;
          border: none;
          color: var(--color-accent);
          font-weight: 600;
          margin-left: 4px;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }
        .login-toggle:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
