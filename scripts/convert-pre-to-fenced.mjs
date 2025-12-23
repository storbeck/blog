import { promises as fs } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const postsDir = path.join(root, 'content', 'posts')

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")

const convertPreBlocks = (text) => {
  return text.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_match, code) => {
    const normalized = decodeEntities(code.replace(/^\n+/, '').replace(/\n+$/, ''))
    return `\n\`\`\`\n${normalized}\n\`\`\`\n`
  })
}

const main = async () => {
  const entries = await fs.readdir(postsDir)
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue
    const filePath = path.join(postsDir, entry)
    const original = await fs.readFile(filePath, 'utf8')
    const updated = convertPreBlocks(original)
    if (updated !== original) {
      await fs.writeFile(filePath, updated, 'utf8')
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
