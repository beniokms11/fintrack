'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useApp } from '@/components/providers/AppProvider'
import { ArrowLeft, FileSpreadsheet, Download, ChevronRight } from 'lucide-react'
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
                <span style={{ display: 'block', fontWeight: 500 }}>Exporter en PDF</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Prêt pour l'impression</span>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
          </div>

          <div id="print-content" className="print-only">
            <h1>Rapport Financier - FinTrack</h1>
            <p>Généré le {new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Catégorie</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td>{tx.category?.name}</td>
                    <td style={{ color: tx.type === 'income' ? '#10B981' : '#EF4444' }}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount} FCFA
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
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
        }
      `}</style>
    </>
  )
}
