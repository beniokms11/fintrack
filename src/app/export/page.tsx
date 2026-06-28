'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { ArrowLeft, FileSpreadsheet, Download, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatXOF, formatDate } from '@/lib/utils'

export default function ExportPage() {
  const { transactions, stats } = useApp()

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
    a.download = `fintrack_export_${new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    window.print()
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

          <div className="card" style={{ cursor: 'pointer' }} onClick={handleExportPDF} id="btn-export-pdf">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                background: 'var(--color-accent-light)', color: 'var(--color-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Download size={18} /></div>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontWeight: 500 }}>Exporter en PDF / Imprimer</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Rapport financier complet prêt à l&apos;impression</span>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
          </div>

          {/* Premium PDF Report section */}
          <div id="print-content" className="print-only">
            <div className="print-header">
              <span className="print-logo">📊 FinTrack</span>
              <h1>Rapport Financier Personnel</h1>
              <p className="print-date">
                Généré le {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div className="print-stats-grid">
              <div className="print-stat-card">
                <span className="print-stat-label">Solde Total</span>
                <span className="print-stat-value">{formatXOF(stats.totalBalance)}</span>
              </div>
              <div className="print-stat-card">
                <span className="print-stat-label">Revenus (30j)</span>
                <span className="print-stat-value income-text">+{formatXOF(stats.totalIncome)}</span>
              </div>
              <div className="print-stat-card">
                <span className="print-stat-label">Dépenses (30j)</span>
                <span className="print-stat-value expense-text">-{formatXOF(stats.totalExpenses)}</span>
              </div>
              <div className="print-stat-card">
                <span className="print-stat-label">Épargne cumulée</span>
                <span className="print-stat-value">{formatXOF(stats.totalSavings)}</span>
              </div>
            </div>

            <h2>Historique des transactions ({transactions.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Portefeuille</th>
                  <th>Catégorie</th>
                  <th>Description</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{formatDate(tx.date, 'short')}</td>
                    <td>{tx.wallet?.name || 'Espèces'}</td>
                    <td>{tx.category?.name || '-'}</td>
                    <td>{tx.description}</td>
                    <td className={tx.type === 'income' ? 'income-cell' : 'expense-cell'}>
                      {tx.type === 'income' ? '+' : '-'}{formatXOF(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BottomNav />
      <style jsx>{`
        .print-only {
          display: none;
        }
        @media print {
          :global(nav), :global(header), :global(.btn), :global(.card) {
            display: none !important;
          }
          .print-only {
            display: block !important;
            padding: 20px;
            color: black !important;
            font-family: 'Inter', -apple-system, sans-serif;
          }
          .print-header {
            border-bottom: 2px solid #111827;
            padding-bottom: 15px;
            margin-bottom: 25px;
            text-align: center;
          }
          .print-logo {
            font-size: 20px;
            font-weight: 800;
            color: #10B981;
          }
          .print-header h1 {
            font-size: 28px;
            font-weight: 800;
            margin-top: 5px;
          }
          .print-date {
            font-size: 12px;
            color: #4b5563;
            margin-top: 5px;
          }
          .print-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .print-stat-card {
            border: 1px solid #e5e7eb;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            background: #f9fafb;
            -webkit-print-color-adjust: exact;
          }
          .print-stat-label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            color: #4b5563;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .print-stat-value {
            font-size: 16px;
            font-weight: 800;
          }
          .income-text { color: #10B981; }
          .expense-text { color: #EF4444; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 10px;
            text-align: left;
            font-size: 12px;
          }
          th {
            background-color: #f3f4f6;
            font-weight: 700;
            -webkit-print-color-adjust: exact;
          }
          .income-cell {
            color: #10B981;
            font-weight: 700;
          }
          .expense-cell {
            color: #EF4444;
            font-weight: 700;
          }
        }
      `}</style>
    </>
  )
}
