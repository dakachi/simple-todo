export function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTomorrowString(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const year = tomorrow.getFullYear()
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const day = String(tomorrow.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(dateString: string): string {
  const today = getTodayString()
  const tomorrow = getTomorrowString()
  
  if (dateString === today) return 'Today'
  if (dateString === tomorrow) return 'Tomorrow'
  
  const date = new Date(dateString + 'T00:00:00')
  const now = new Date()
  
  // Check if it's in the past
  if (date < new Date(today + 'T00:00:00')) {
    return 'Earlier'
  }
  
  // Future dates
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  }
  return date.toLocaleDateString('en-US', options)
}

export function compareDates(a: string, b: string): number {
  return a.localeCompare(b)
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayString()
}

export function isPast(dateString: string): boolean {
  return dateString < getTodayString()
}

export function isFuture(dateString: string): boolean {
  return dateString > getTodayString()
}
