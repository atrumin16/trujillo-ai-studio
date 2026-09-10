import { Eye, ExternalLink, Archive } from 'lucide-react'
import { Button } from './ui/button'

type Artifact = {
  id: string
  title: string
  type: 'GUIDES' | 'LIBRARY'
  handle: string
}

export function ArtifactList({ items }: { items: Artifact[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="group relative flex flex-col gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 backdrop-blur-md transition-all hover:border-slate-500/80 md:flex-row md:items-center"
        >
          {/* Icon/Thumbnail Placeholder */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-white">
            {item.type === 'GUIDES' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-base font-semibold text-white truncate">{item.title}</h3>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                item.type === 'GUIDES' 
                  ? 'bg-cyan-950/60 border border-cyan-800/80 text-cyan-300' 
                  : 'bg-amber-950/60 border border-amber-800/80 text-amber-300'
              }`}>
                {item.type}
              </span>
            </div>
            <p className="font-mono text-xs text-slate-500">@atrumin16/{item.handle}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:self-end">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-white">
              Ver
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-white">
              Abrir
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400">
              <Archive className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
