'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { ArrowLeft, FileSpreadsheet, Download } from 'lucide-react'
import Link from 'next/link'

export default function ExportPage() {
  const { transactions } = useApp()

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Catégorie', 'Description', 'Portefeuille', 'Marchand', 'Montant (FCFA)']
    const rows = transactions.map(tx => [
      tx.date,
      tx.type === 'income' ? 'Revenu' : 'Dépense',
      tx.category?.name || '',
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.wallet?.name || '',
      tx.merchant || '',
      tx.type === 'income' ? tx.amount : -tx.amount,
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fintrack_export_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Exporter</h1>
          </div>
        </header>

        <div className="page-content">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-lg)' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--radius-lg)',
              background: 'var(--color-accent-light)', color: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-lg)',
            }}>
              <FileSpreadsheet size={28} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
              Exporter en CSV
            </h2>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: 280, margin: '0 auto var(--space-xl)' }}>
              Télécharge toutes tes transactions au format CSV, compatible avec Excel et Google Sheets.
            </p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-lg)' }}>
              {transactions.length} transactions à exporter
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleExportCSV} style={{ width: '100%' }} id="btn-export-csv">
              <Download size={18} /> Télécharger le CSV
            </button>
          </div>

          <div className="card" style={{ opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                background: 'var(--color-surface-hover)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>📄</div>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontWeight: 500 }}>Export PDF</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Bientôt disponible</span>
              </div>
              <span className="badge">v2</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
