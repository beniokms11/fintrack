'use client'

import { AIInsight } from '@/lib/types'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Info } from 'lucide-react'

interface AIInsightCardProps {
  insights: AIInsight[]
}

export default function AIInsightCard({ insights }: AIInsightCardProps) {
  if (!insights.length) return null

  const primary = insights[0]

  const typeConfig = {
    positive: { bg: 'var(--color-accent-light)', color: 'var(--color-accent)', Icon: TrendingUp },
    warning: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', Icon: AlertTriangle },
    tip: { bg: 'var(--color-info-light)', color: 'var(--color-info)', Icon: Lightbulb },
    neutral: { bg: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', Icon: Info },
  }

  const config = typeConfig[primary.type]

  return (
    <div className="ai-insight-card" id="card-ai-insight">
      <div className="ai-header">
        <div className="ai-badge">
          <Brain size={13} />
          <span>FinTrack AI</span>
        </div>
      </div>

      <div className="ai-insight-main">
        <div className="ai-insight-icon" style={{ background: config.bg, color: config.color }}>
          <config.Icon size={18} />
        </div>
        <div className="ai-insight-content">
          <span className="ai-insight-title font-headline">{primary.title}</span>
          <p className="ai-insight-message">{primary.message}</p>
        </div>
      </div>

      {insights.length > 1 && (
        <div className="ai-insight-more">
          <span className="ai-insight-more-text">+{insights.length - 1} autre{insights.length > 2 ? 's' : ''} insight{insights.length > 2 ? 's' : ''}</span>
        </div>
      )}

      <style jsx>{`
        .ai-insight-card {
          background: var(--color-surface);
          border: none;
          border-radius: var(--radius-lg);
          padding: var(--space-xl) var(--space-lg);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
          transition: all var(--transition-base);
        }
        .ai-insight-card:hover {
          box-shadow: var(--shadow-md);
        }
        .ai-insight-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle at top right, var(--color-accent-subtle), transparent 70%);
          pointer-events: none;
        }
        .ai-header {
          margin-bottom: var(--space-md);
        }
        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: 4px 12px;
          font-size: var(--font-size-xs);
          font-weight: 700;
          font-family: var(--font-headline);
          border-radius: var(--radius-full);
          background: var(--color-accent-light);
          color: var(--color-accent);
          letter-spacing: 0.02em;
        }
        .ai-insight-main {
          display: flex;
          gap: var(--space-md);
        }
        .ai-insight-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ai-insight-content {
          flex: 1;
        }
        .ai-insight-title {
          display: block;
          font-size: var(--font-size-base);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 3px;
        }
        .ai-insight-message {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
        .ai-insight-more {
          margin-top: var(--space-md);
          padding-top: var(--space-md);
          border-top: 1px solid var(--color-border-light);
        }
        .ai-insight-more-text {
          font-size: var(--font-size-xs);
          color: var(--color-accent);
          font-weight: 600;
          cursor: pointer;
        }
        .ai-insight-more-text:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
