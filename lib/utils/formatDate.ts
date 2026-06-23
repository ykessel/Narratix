import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

/** Ej: "12 de junio de 2025" */
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), "d 'de' MMMM 'de' yyyy", { locale: es })
}

/** Ej: "hace 3 días" */
export function timeAgo(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: es })
}

/** Ej: "Jun 12, 2025" — para uso en datetime ISO attributes */
export function formatDateShort(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy')
}
