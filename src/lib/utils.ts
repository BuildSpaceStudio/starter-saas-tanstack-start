import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function getInitials(value: string | null | undefined) {
  if (!value) {
    return 'YP'
  }

  return value
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function toPercent(value: number) {
  return `${Math.round(value)}%`
}
