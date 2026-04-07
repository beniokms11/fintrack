'use client'

import { QUOTES } from '@/lib/constants'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function QuoteCard() {
  const [quote, setQuote] = useState(QUOTES[0])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length)
    setQuote(QUOTES[randomIndex])
  }, [])

  return (
    <div className="quote-card" id="card-quote">
      <div className="quote-icon">
        <Sparkles size={16} />
      </div>
      <p className="quote-text">&ldquo;{quote.text}&rdquo;</p>
      <p className="quote-author">— {quote.author}</p>

      <style jsx>{`
        .quote-card {
          background: var(--color-surface);
          border: none;
          border-radius: var(--radius-lg);
          padding: var(--space-xl) var(--space-lg);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
          transition: all var(--transition-base);
        }
        .quote-card:hover {
          box-shadow: var(--shadow-md);
        }
        .quote-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover), transparent);
          border-radius: 3px 3px 0 0;
        }
        .quote-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--color-accent-light);
          color: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-md);
        }
        .quote-text {
          font-size: var(--font-size-base);
          color: var(--color-text-primary);
          line-height: 1.6;
          font-style: italic;
          margin-bottom: var(--space-sm);
        }
        .quote-author {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          font-weight: 600;
          font-family: var(--font-headline);
        }
      `}</style>
    </div>
  )
}
