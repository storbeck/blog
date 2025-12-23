import { promises as fs } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const postsDir = path.join(root, 'content', 'posts')

const shouldTrimLine = (line) => line.trim().length > 0

const normalizeContent = (text) => {
  const lines = text.split('\n')
  let inPre = false
  const output = lines.map((line) => {
    const trimmed = line.trim()
    if (trimmed.includes('<pre')) inPre = true
    if (!inPre && shouldTrimLine(line)) {
      line = line.replace(/^\s+/, '')
    }
    if (trimmed.includes('</pre>')) inPre = false
    return line
  })
  return output.join('\n')
}

const main = async () => {
  const entries = await fs.readdir(postsDir)
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue
    const filePath = path.join(postsDir, entry)
    const original = await fs.readFile(filePath, 'utf8')
    const updated = normalizeContent(original)
    if (updated !== original) {
      await fs.writeFile(filePath, updated, 'utf8')
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
