'use client'

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export function AdminCard({
  children,
  className,
  padding = 'md',
  interactive,
}: {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}) {
  const pad = padding === 'none' ? '' : padding === 'sm' ? 'p-4' : padding === 'lg' ? 'p-6 sm:p-8' : 'p-4 sm:p-6'
  return (
    <section
      className={cn(
        'rounded-[20px] border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_-8px_rgba(15,23,42,0.08)] transition-all duration-300',
        interactive && 'hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_4px_10px_rgba(15,23,42,0.05),0_20px_44px_-12px_rgba(15,23,42,0.14)]',
        pad,
        className,
      )}
    >
      {children}
    </section>
  )
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#c45f12]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E87F24]" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className="mt-1.5 text-2xl font-extrabold tracking-[-0.045em] text-slate-900 sm:text-[1.85rem]">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function AdminField({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</div>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-5 text-slate-400">{hint}</p> : null}
    </label>
  )
}

const controlBase =
  'w-full rounded-[12px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-[#E87F24]/60 focus:ring-[3px] focus:ring-[#E87F24]/12 disabled:bg-slate-50 disabled:opacity-60'

export function AdminInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, className)} {...props} />
}

export function AdminTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlBase, 'min-h-[110px] resize-y', className)} {...props} />
}

export function AdminSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlBase, className)} {...props}>
      {children}
    </select>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
type ButtonSize = 'sm' | 'md'

export function AdminButton({
  variant = 'secondary',
  size = 'md',
  loading,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean }) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-b from-[#F0954A] to-[#E0711C] text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_6px_16px_-4px_rgba(224,113,28,0.55)] hover:from-[#f4a35f] hover:to-[#d6671a] active:shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_2px_8px_-2px_rgba(224,113,28,0.5)]',
    secondary:
      'border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800',
    danger: 'border border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-300 hover:bg-orange-100',
    accent: 'border border-sky-200 bg-sky-50 text-sky-800 hover:border-sky-300 hover:bg-sky-100',
  }
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-[10px]',
    md: 'px-4 py-2.5 text-sm gap-2 rounded-[12px]',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={size === 'sm' ? 13 : 15} className="animate-spin" /> : null}
      {children}
    </button>
  )
}

export function AdminIconButton({
  className,
  children,
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border transition-all duration-150 active:scale-95',
        active
          ? 'border-[#E87F24]/30 bg-orange-50 text-[#c45f12]'
          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function AdminBadge({
  children,
  tone = 'neutral',
  dot,
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent' | 'info'
  dot?: boolean
  className?: string
}) {
  const tones = {
    neutral: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-orange-50 text-orange-700',
    accent: 'bg-gradient-to-b from-[#F0954A] to-[#E0711C] text-white',
    info: 'bg-sky-50 text-sky-700',
  }
  const dotTones = {
    neutral: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-orange-500',
    accent: 'bg-white',
    info: 'bg-sky-500',
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]', tones[tone], className)}>
      {dot ? <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotTones[tone])} /> : null}
      {children}
    </span>
  )
}

export function AdminAlert({
  tone = 'error',
  title,
  children,
  actions,
}: {
  tone?: 'error' | 'success' | 'warning' | 'info'
  title?: string
  children: ReactNode
  actions?: ReactNode
}) {
  const tones = {
    error: 'border-orange-200 bg-orange-50 text-orange-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-sky-200 bg-sky-50 text-sky-900',
  }
  return (
    <div className={cn('animate-in fade-in slide-in-from-top-1 rounded-[16px] border px-4 py-3 text-sm duration-200', tones[tone])}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {title ? <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] opacity-80">{title}</div> : null}
          <div className="leading-6">{children}</div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
      {icon ? (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] bg-white text-[#E87F24] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_6px_16px_-4px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function AdminStat({
  label,
  value,
  hint,
  icon,
  trend,
  onClick,
}: {
  label: string
  value: string | number
  hint?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  onClick?: () => void
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-[18px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_-8px_rgba(15,23,42,0.08)] transition-all duration-200',
        onClick && 'hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_4px_12px_-2px_rgba(224,113,28,0.16)]',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</div>
        {icon ? (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-orange-50 text-[#E87F24] transition-colors group-hover:bg-[#E87F24] group-hover:text-white">
            {icon}
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <div className="text-[1.85rem] font-extrabold leading-none tracking-[-0.04em] text-slate-900">{value}</div>
        {trend && trend !== 'neutral' ? (
          <span className={cn('text-xs font-bold', trend === 'up' ? 'text-emerald-600' : 'text-orange-600')}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        ) : null}
      </div>
      {hint ? <div className="mt-1.5 text-xs text-slate-500">{hint}</div> : null}
    </Comp>
  )
}

export function AdminRing({
  value,
  total,
  size = 64,
  stroke = 6,
  label,
}: {
  value: number
  total: number
  size?: number
  stroke?: number
  label?: string
}) {
  const pct = total ? Math.min(1, value / total) : 0
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E87F24"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-extrabold text-slate-900">{label ?? `${Math.round(pct * 100)}%`}</span>
      </div>
    </div>
  )
}

export function AdminAvatar({
  name,
  size = 36,
  className,
}: {
  name: string
  size?: number
  className?: string
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?'
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#73A5CA] to-[#4a7a9a] font-bold text-white',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

export function AdminKbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center gap-0.5 rounded-[6px] border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
      {children}
    </kbd>
  )
}

export function AdminSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-100', className)} />
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  danger,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null
  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-2 w-full max-w-md rounded-[20px] border border-slate-200 bg-white p-5 shadow-2xl duration-200">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <AdminButton onClick={onCancel} disabled={loading}>
            Cancel
          </AdminButton>
          <AdminButton variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  )
}

export const adminInputClass = controlBase
