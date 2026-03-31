'use client'

import { useState } from 'react'
import { ArrowLeft, HelpCircle, ChevronDown, Mail, MessageSquare, Phone } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/navigation/BottomNav'

const FAQS = [
  {
    question: "Comment ajouter une transaction ?",
    answer: "Clique sur le bouton vert '+' au centre de ton menu en bas. Choisis le type (Dépense ou Revenu), saisis le montant, la catégorie et ton portefeuille."
  },
  {
    question: "Puis-je modifier mes catégories ?",
    answer: "Dans cette version, les catégories sont prédéfinies. La personnalisation arrive très bientôt dans une prochaine mise à jour !"
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Oui, FinTrack utilise Supabase pour sécuriser tes données. Chaque utilisateur possède son propre espace privé protégé par un mot de passe."
  },
  {
    question: "Comment fonctionne l'IA ?",
    answer: "L'assistant IA analyse tes habitudes de dépenses pour te donner des conseils personnalisés directement sur ton tableau de bord."
  }
]

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/settings" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Aide & Support</h1>
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
              <HelpCircle size={28} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Questions fréquentes</h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Trouve rapidement des réponses à tes questions.
            </p>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <div key={index} className="card faq-item" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                <div className="faq-question">
                  <span>{faq.question}</span>
                  <ChevronDown size={18} style={{ 
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                    color: openIndex === index ? 'var(--color-accent)' : 'var(--color-text-tertiary)'
                  }} />
                </div>
                {openIndex === index && (
                  <div className="faq-answer animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 'var(--space-xl)' }}>
            <h3 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>Besoin d'aide supplémentaire ?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <a href="mailto:support@fintrack.app" className="support-link">
                <div className="support-icon"><Mail size={18} /></div>
                <div className="support-info">
                  <span className="support-label">Par Email</span>
                  <span className="support-value">support@fintrack.app</span>
                </div>
              </a>
              <div className="support-link">
                <div className="support-icon" style={{ background: 'var(--color-bg)' }}><Phone size={18} /></div>
                <div className="support-info">
                  <span className="support-label">Par téléphone / WhatsApp</span>
                  <span className="support-value">+229 00 00 00 00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
      <style jsx>{`
        .faq-item {
          padding: var(--space-lg) !important;
          margin-bottom: var(--space-sm);
          cursor: pointer;
        }
        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          font-size: var(--font-size-base);
          color: var(--color-text-primary);
        }
        .faq-answer {
          margin-top: var(--space-md);
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
        .support-link {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-sm);
          border-radius: var(--radius-md);
          text-decoration: none;
          color: inherit;
        }
        .support-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: var(--color-accent-light);
          color: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .support-info {
          display: flex;
          flex-direction: column;
        }
        .support-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
        }
        .support-value {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-text-primary);
        }
      `}</style>
    </>
  )
}
