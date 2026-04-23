import type * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SidebarItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

function SidebarNav({
  items,
  currentPath,
}: {
  items: SidebarItem[]
  currentPath: string
}) {
  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon
        const active =
          currentPath === item.to || currentPath.startsWith(`${item.to}/`)

        return (
          <Link
            className={cn(
              'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
              active
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
            key={item.to}
            to={item.to}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function Sidebar({
  items,
  currentPath,
  footer,
}: {
  items: SidebarItem[]
  currentPath: string
  footer?: React.ReactNode
}) {
  const brand = (
    <div className="mb-6 flex shrink-0 items-center gap-3 px-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
        YP
      </div>
      <div>
        <p className="text-sm font-semibold text-sidebar-foreground">Your Product</p>
        <p className="text-xs text-muted-foreground">Starter SaaS</p>
      </div>
    </div>
  )

  const nav = (
    <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-2">
      <SidebarNav currentPath={currentPath} items={items} />
    </div>
  )

  const footerSlot = footer ? (
    <div className="shrink-0 border-t border-sidebar-border px-2 pb-2 pt-4">{footer}</div>
  ) : null

  return (
    <>
      <aside className="hidden h-full min-h-0 w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-5 py-6 lg:flex">
        {brand}
        {nav}
        {footerSlot}
      </aside>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="left-0 top-0 flex h-full max-w-sm translate-x-0 translate-y-0 flex-col rounded-none border-r p-6">
            {brand}
            {nav}
            {footerSlot}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
