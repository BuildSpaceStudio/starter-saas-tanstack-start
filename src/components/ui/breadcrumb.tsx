import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Breadcrumb({
  items,
  className,
}: {
  items: Array<{ label: string; to?: string }>
  className?: string
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      {items.map((item, index) => (
        <span className="flex items-center gap-2" key={`${item.label}-${index}`}>
          {item.to ? (
            <Link className="transition hover:text-foreground" to={item.to}>
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
          {index < items.length - 1 ? <ChevronRight className="h-4 w-4" /> : null}
        </span>
      ))}
    </nav>
  )
}
