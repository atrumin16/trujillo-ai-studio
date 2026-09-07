import { useEffect, useMemo, useRef, useState } from 'react'
import { LANGS, TOP_LANGS, type Lang } from '@/lib/lang-catalog'
import { t } from '@/lib/i18n'

function persistLang(id: Lang) {
  try {
    localStorage.setItem('ta_lang', id)
    document.cookie = 'ta_lang=' + id + ';path=/;max-age=31536000;SameSite=Lax'
  } catch {
    /* ignore */
  }
}

export function LanguagePicker({
  value,
  onChange,
  lang,
}: {
  value: Lang
  onChange: (id: Lang) => void
  lang: string
}) {
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)
  const [geoPin, setGeoPin] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const current = LANGS.find((l) => l.id === value) || LANGS[0]
  useEffect(() => {
    function read() {
      try {
        const g = (window as unknown as { TA_GEO?: { lang?: string } }).TA_GEO
        if (g?.lang) setGeoPin(g.lang)
      } catch {
        /* ignore */
      }
    }
    read()
    if (!open) return
    read()
  }, [open])
  const top = useMemo(() => {
    const ids = [...TOP_LANGS] as string[]
    if (geoPin && !ids.includes(geoPin)) ids.unshift(geoPin)
    if (!ids.includes(value)) ids.unshift(value)
    return ids.map((id) => LANGS.find((l) => l.id === id)).filter(Boolean) as typeof LANGS[number][]
  }, [value, geoPin])
  const rest = LANGS.filter((l) => !top.some((x) => x.id === l.id))

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false)
        setMore(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  function pick(id: Lang) {
    persistLang(id)
    onChange(id)
    setOpen(false)
    setMore(false)
  }

  return (
    <div ref={root} className="relative w-full max-w-xs">
      <button
        type="button"
        className="flex h-9 w-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-left text-sm"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
      >
        <span className="truncate">{current.native}</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
          {top.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm ${l.id === value ? 'bg-[var(--surface-2)] font-semibold' : 'hover:bg-[var(--surface-2)]'}`}
              onClick={() => pick(l.id)}
            >
              <span className="truncate">{l.native}</span>
            </button>
          ))}
          {more && (
            <>
              <div className="my-1 h-px bg-[var(--border)]" />
              {rest.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm ${l.id === value ? 'bg-[var(--surface-2)] font-semibold' : 'hover:bg-[var(--surface-2)]'}`}
                  onClick={() => pick(l.id)}
                >
                  <span className="truncate">{l.native}</span>
                </button>
              ))}
            </>
          )}
          <button
            type="button"
            className="mt-0.5 w-full rounded-lg px-2.5 py-2 text-center text-xs font-semibold text-[var(--dim)] hover:bg-[var(--surface-2)]"
            onClick={(e) => {
              e.stopPropagation()
              setMore((v) => !v)
            }}
          >
            {more ? t(lang, 'showLess') : t(lang, 'showMore')}
          </button>
        </div>
      )}
    </div>
  )
}
