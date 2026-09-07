import type { Prefs, SettingsTab } from '@/lib/prefs'
import { cn } from '@/lib/utils'
import { UserAvatar } from './UserAvatar'

export function AccountMenu({
  L,
  prefs,
  onOpenSettings,
  variant,
}: {
  L: (k: string) => string
  prefs: Prefs
  onChange?: (p: Prefs) => void
  onOpenSettings: (tab?: SettingsTab) => void
  onExport?: () => void
  variant: 'header' | 'sidebar'
}) {
  const display = prefs.name.trim() || L('guest')

  return (
    <button
      type="button"
      aria-label={`${display} — ${L('openSettings')}`}
      title={L('openSettings')}
      onClick={() => onOpenSettings('account')}
      className={cn(
        'flex items-center gap-2 rounded-xl text-left transition-colors hover:bg-[var(--surface-2)]',
        variant === 'sidebar' ? 'w-full px-2 py-2' : 'py-1 pl-1 pr-2',
      )}
    >
      <UserAvatar name={prefs.name} size={variant === 'sidebar' ? 'md' : 'sm'} />
      <span className="min-w-0 flex-1">
        <span className={cn('block truncate font-medium', variant === 'sidebar' ? 'text-sm' : 'max-w-[9.5rem] text-sm')}>
          {display}
        </span>
        {variant === 'sidebar' && (
          <span className="block truncate text-[11px] text-[var(--dim)]">{prefs.email.trim() || L('workspaceLocal')}</span>
        )}
      </span>
    </button>
  )
}
