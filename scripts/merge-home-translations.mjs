import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const translationsDir = join(__dirname, '../src/translations')
const homeKeys = JSON.parse(readFileSync(join(__dirname, 'home-i18n-keys.json'), 'utf8'))

for (const [lang, keys] of Object.entries(homeKeys)) {
  const filePath = join(translationsDir, `${lang}.json`)
  const existing = JSON.parse(readFileSync(filePath, 'utf8'))
  const merged = { ...existing, ...keys }
  const sorted = Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(filePath, `${JSON.stringify(sorted, null, 2)}\n`)
}

console.log('Merged home translations into all language files.')
