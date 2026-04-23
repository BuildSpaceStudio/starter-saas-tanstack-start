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
  children,
}: {
  items: SidebarItem[]
  currentPath: string
  children?: React.ReactNode
}) {
  return (
    <>
      <aside className="hidden h-full w-72 shrink-0 border-r border-sidebar-border bg-sidebar px-5 py-6 lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
            YP
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">Your Product</p>
            <p className="text-xs text-muted-foreground">Starter SaaS</p>
          </div>
        </div>
        <SidebarNav currentPath={currentPath} items={items} />
        {children ? <div className="mt-6">{children}</div> : null}
      </aside>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="left-0 top-0 h-full max-w-sm translate-x-0 translate-y-0 rounded-none border-r">
            <div className="mt-10">
              <SidebarNav currentPath={currentPath} items={items} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
