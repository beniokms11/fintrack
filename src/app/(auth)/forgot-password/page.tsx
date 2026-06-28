'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { forgotPassword } from '../login/actions'
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await forgotPassword(formData)
      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        setSuccess(true)
      }
    } catch (err) {
      console.error(err)
      setError("Une erreur est survenue lors de l'envoi de l'e-mail.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box animate-fade-in-up">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-icon">🔐</span>
            <h1>Mot de passe oublié</h1>
          </div>
          <p className="login-subtitle">
            Saisissez votre e-mail pour recevoir un lien de réinitialisation sécurisé.
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
            <h3>E-mail envoyé !</h3>
            <p>
              Vérifiez votre boîte de réception (et vos spams). Cliquez sur le lien reçu pour choisir votre nouveau mot de passe.
            </p>
            <Link href="/login" className="btn btn-primary btn-lg w-full mt-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
              <ArrowLeft size={18} /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
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

            <button 
              type="submit" 
              className="btn btn-primary btn-lg login-btn"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Envoyer le lien de réinitialisation'}
            </button>

            <div className="mt-6 text-center">
              <Link href="/login" className="back-link">
                <ArrowLeft size={16} /> Retour à la connexion
              </Link>
            </div>
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
          margin-bottom: var(--space-xl);
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
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .back-link:hover {
          color: var(--color-accent);
        }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .w-full { width: 100%; }
      `}</style>
    </div>
  )
}
