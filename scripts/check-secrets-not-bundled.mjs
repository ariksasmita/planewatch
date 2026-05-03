import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const roots = ['.output', '.nuxt'].filter(existsSync)
const needles = process.argv.slice(2).filter(Boolean)

if (needles.length === 0) {
  console.log('no secret sentinel values provided; skipping scan')
  process.exit(0)
}

function* files(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) yield* files(path)
    else if (stat.isFile()) yield path
  }
}

for (const root of roots) {
  for (const file of files(root)) {
    const text = readFileSync(file, 'utf8')
    for (const needle of needles) {
      if (text.includes(needle)) {
        console.error(`secret sentinel found in build output: ${file}`)
        process.exit(1)
      }
    }
  }
}

console.log('secret sentinel values not found in build output')
