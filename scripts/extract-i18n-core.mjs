import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const s = fs.readFileSync(path.join(root, 'public', 'assets', 'i18n.js'), 'utf8')
const start = s.indexOf('var I18N = {')
const end = s.indexOf('\n  };', start)
if (start < 0 || end < 0) throw new Error('I18N block not found')
const block = s.slice(start, end + 5).replace('var I18N = ', 'const I18N = ')
const fn = new Function(block + '\nreturn I18N;')
const I18N = fn()
const codes = ['es', 'en', 'fr', 'pt', 'de', 'it', 'ca', 'zh']
const packs = {}
for (const c of codes) packs[c] = {}
for (const [k, row] of Object.entries(I18N)) {
  if (!Array.isArray(row)) continue
  codes.forEach((c, i) => {
    packs[c][k] = row[i] ?? row[1] ?? row[0] ?? k
  })
}
const out = path.join(root, 'scripts', '_i18n_core.json')
fs.writeFileSync(out, JSON.stringify({ codes, packs, keys: Object.keys(I18N) }, null, 2))
console.log('keys', Object.keys(I18N).length, '->', out)
