/**
 * Format a number as XOF currency
 * @example formatXOF(150000) → "150 000 FCFA"
 * @example formatXOF(150000, { compact: true }) → "150K"
 */
export function formatXOF(amount: number, options?: { compact?: boolean; showSign?: boolean }): string {
  const { compact = false, showSign = false } = options || {}

  if (compact) {
    const abs = Math.abs(amount)
    if (abs >= 1_000_000) {
      return `${showSign && amount > 0 ? '+' : ''}${(amount / 1_000_000).toFixed(1).replace('.0', '')}M`
    }
    if (abs >= 1_000) {
      return `${showSign && amount > 0 ? '+' : ''}${(amount / 1_000).toFixed(0)}K`
    }
    return `${showSign && amount > 0 ? '+' : ''}${amount}`
  }

  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))

  const sign = showSign && amount > 0 ? '+' : amount < 0 ? '-' : ''
  return `${sign}${formatted} FCFA`
}

/**
 * Format a date in French
 * @example formatDate(new Date()) → "30 mars 2026"
 */
export function formatDate(date: Date | string, style: 'full' | 'short' | 'relative' = 'full'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (style === 'relative') {
    return formatRelativeDate(d)
  }

  if (style === 'short') {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
    }).format(d)
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`
  if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`
  return `Il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? 's' : ''}`
}

/**
 * Format a percentage
 * @example formatPercent(0.75) → "75%"
 */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

/**
 * Get greeting based on time of day (in French)
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  // Before 17:00 (5 PM), say "Bonjour", after say "Bonsoir"
  if (hour < 17) return 'Bonjour'
  return 'Bonsoir'
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Delay for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 1) + '…'
}
