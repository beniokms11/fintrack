'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { formatXOF } from '@/lib/utils'
import Link from 'next/link'
import {
  Target,
  Wallet,
  BarChart3,
  Bot,
  Settings,
  FileDown,
  ChevronRight,
  Moon,
  Sun,
  PiggyBank,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function MorePage() {
  const { theme, toggleTheme } = useTheme()
  const { wallets, savingsGoals } = useApp()

  const menuSections = [
    {
      title: 'Finances',
      items: [
        { icon: Wallet, label: 'Portefeuilles', href: '/wallets', badge: `${wallets.length}` },
        { icon: Target, label: "Objectifs d'épargne", href: '/savings', badge: `${savingsGoals.length}` },
        { icon: BarChart3, label: 'Statistiques', href: '/stats' },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { icon: Bot, label: 'Assistant IA', href: '/assistant', badge: 'Nouveau' },
      ],
    },
    {
      title: 'Général',
      items: [
        { icon: FileDown, label: 'Exporter les données', href: '/export' },
        { icon: Settings, label: 'Paramètres', href: '/settings' },
      ],
    },
  ]

  return (
    <>
      <div className="page">
        <header className="page-header">
          <h1 className="page-title">Plus</h1>
          <button
            className="btn btn-icon btn-ghost"
            onClick={toggleTheme}
            aria-label="Changer le thème"
            id="btn-toggle-theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="page-content">
          {/* Savings Goals Preview */}
          <div className="card" id="savings-preview">
            <div className="section-header">
              <h2 className="section-title">
                <PiggyBank size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px', color: 'var(--color-accent)' }} />
                Objectifs d&apos;épargne
              </h2>
              <Link href="/savings" className="section-link">
                Voir tout <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </Link>
            </div>
            <div className="savings-preview-list">
              {savingsGoals.slice(0, 2).map(goal => {
                const pct = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0
                return (
                  <div key={goal.id} className="savings-preview-item">
                    <div className="savings-preview-icon">{goal.icon}</div>
                    <div className="savings-preview-info">
                      <span className="savings-preview-name">{goal.name}</span>
                      <div className="progress-bar" style={{ marginTop: '4px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${pct * 100}%`, background: goal.color }}
                        />
                      </div>
                      <span className="savings-preview-amounts tabular-nums">
                        {formatXOF(goal.current_amount)} / {formatXOF(goal.target_amount)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Menu Sections */}
          {menuSections.map(section => (
            <div key={section.title} className="menu-section">
              <h3 className="menu-section-title">{section.title}</h3>
              <div className="menu-list card">
                {section.items.map((item, i) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`menu-item ${i < section.items.length - 1 ? 'menu-item-bordered' : ''}`}
                    id={`menu-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <div className="menu-item-left">
                      <div className="menu-item-icon">
                        <item.icon size={18} />
                      </div>
                      <span className="menu-item-label">{item.label}</span>
                    </div>
                    <div className="menu-item-right">
                      {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                      <ChevronRight size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />

      <style jsx>{`
        .savings-preview-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .savings-preview-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .savings-preview-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--color-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .savings-preview-info {
          flex: 1;
          min-width: 0;
        }
        .savings-preview-name {
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--color-text-primary);
        }
        .savings-preview-amounts {
          display: block;
          margin-top: 4px;
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
        }
        .menu-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .menu-section-title {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .menu-list {
          padding: 0 !important;
          overflow: hidden;
        }
        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg);
          text-decoration: none;
          color: inherit;
          transition: background var(--transition-fast);
        }
        .menu-item:hover {
          background: var(--color-surface-hover);
        }
        .menu-item-bordered {
          border-bottom: 1px solid var(--color-border-light);
        }
        .menu-item-left {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .menu-item-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: var(--color-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }
        .menu-item-label {
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--color-text-primary);
        }
        .menu-item-right {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .menu-item-badge {
          font-size: var(--font-size-xs);
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: var(--color-accent-light);
          color: var(--color-accent);
        }
      `}</style>
    </>
  )
}
