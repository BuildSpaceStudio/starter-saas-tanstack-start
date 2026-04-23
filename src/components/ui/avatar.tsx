import type * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn, getInitials } from '@/lib/utils'

export function Avatar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
}

export function AvatarImage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn('aspect-square h-full w-full', className)}
      {...props}
    />
  )
}

export function AvatarFallback({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}

export function UserAvatar({
  name,
  src,
}: {
  name: string | null | undefined
  src?: string | null
}) {
  return (
    <Avatar>
      {src ? <AvatarImage alt={name ?? 'User avatar'} src={src} /> : null}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
