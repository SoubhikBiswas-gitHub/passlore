'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from '@phosphor-icons/react'

import { cn } from '@/lib/utils'

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-[70] bg-scrim data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  )
}

type DialogVariant = 'center' | 'full' | 'bare'

const contentVariants: Record<DialogVariant, string> = {
  center:
    'left-1/2 top-1/2 w-[min(720px,calc(100%-32px))] max-h-[calc(100dvh-32px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] bg-surface p-[22px] text-ink shadow-e3 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-2',
  full: 'inset-0 overflow-y-auto',
  bare: 'inset-0 flex items-center justify-center overflow-y-auto p-4',
}

function DialogContent({
  className,
  children,
  variant = 'center',
  showClose = true,
  overlayClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  variant?: DialogVariant
  showClose?: boolean
  overlayClassName?: string
}) {
  return (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed z-[72] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[240ms] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none',
          contentVariants[variant],
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-sm text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <X size={22} aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-1 pr-12', className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn('flex flex-wrap gap-2.5', className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('m-0 font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em]', className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('m-0 text-[15px] text-ink-2', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
