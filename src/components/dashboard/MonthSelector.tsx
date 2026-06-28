'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react'
import { useApp } from '@/components/providers/AppProvider'

export function formatMonthLabel(monthStr: string) {
  if (!monthStr) return ''
  const [year, m] = monthStr.split('-')
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  const monthIdx = parseInt(m, 10) - 1
  return `${months[monthIdx] || ''} ${year}`
}

export default function MonthSelector() {
  const { selectedMonth, setSelectedMonth } = useApp()

  const currentMonthStr = React.useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }, [])

  const handlePrevMonth = () => {
    if (!selectedMonth) return
    const [year, month] = selectedMonth.split('-').map(Number)
    let newYear = year
    let newMonth = month - 1
    if (newMonth < 1) {
      newMonth = 12
      newYear -= 1
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`)
  }

  const handleNextMonth = () => {
    if (!selectedMonth) return
    const [year, month] = selectedMonth.split('-').map(Number)
    let newYear = year
    let newMonth = month + 1
    if (newMonth > 12) {
      newMonth = 1
      newYear += 1
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`)
  }

  const isCurrent = selectedMonth === currentMonthStr

  return (
    <div className="month-selector-bar">
      <div className="month-selector-container">
        <button
          onClick={handlePrevMonth}
          className="btn-month-nav"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="month-current-display">
          <Calendar size={16} className="month-icon" />
          <span className="month-label font-headline">
            {formatMonthLabel(selectedMonth || currentMonthStr)}
          </span>
        </div>

        <button
          onClick={handleNextMonth}
          className="btn-month-nav"
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {!isCurrent && (
        <button
          onClick={() => setSelectedMonth(currentMonthStr)}
          className="btn-reset-month"
          title="Revenir au mois en cours"
        >
          <RotateCcw size={13} />
          <span>Mois actuel</span>
        </button>
      )}

      <style jsx>{`
        .month-selector-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          margin: var(--space-md) 0 var(--space-lg);
          padding: 0 var(--space-md);
        }
        .month-selector-container {
          display: flex;
          align-items: center;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 4px;
          box-shadow: var(--shadow-sm);
          backdrop-filter: blur(12px);
        }
        .btn-month-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-base);
        }
        .btn-month-nav:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }
        .month-current-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 var(--space-lg);
          color: var(--color-text-primary);
          font-weight: 700;
          font-size: 15px;
        }
        .month-icon {
          color: var(--color-accent);
        }
        .btn-reset-month {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-accent);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }
        .btn-reset-month:hover {
          background: var(--color-accent-light);
        }
      `}</style>
    </div>
  )
}
