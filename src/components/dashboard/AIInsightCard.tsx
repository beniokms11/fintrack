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
          <Brain size={14} />
          <span>FinTrack AI</span>
        </div>
      </div>

      <div className="ai-insight-main">
        <div className="ai-insight-icon" style={{ background: config.bg, color: config.color }}>
          <config.Icon size={18} />
        </div>
        <div className="ai-insight-content">
          <span className="ai-insight-title">{primary.title}</span>
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
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          position: relative;
          overflow: hidden;
        }
        .ai-insight-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
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
          padding: 3px 10px;
          font-size: var(--font-size-xs);
          font-weight: 600;
          border-radius: var(--radius-full);
          background: var(--color-accent-light);
          color: var(--color-accent);
        }
        .ai-insight-main {
          display: flex;
          gap: var(--space-md);
        }
        .ai-insight-icon {
          width: 36px;
          height: 36px;
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
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 2px;
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
          font-weight: 500;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
