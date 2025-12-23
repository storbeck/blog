import { readFileSync } from 'node:fs'
import path from 'node:path'

export type DemoSummary = {
  slug: string
  title: string
  description: string
  date: string
  category?: string
  legacyUrl: string
  legacyFile: string
}

const demosPath = path.join(process.cwd(), 'data', 'demos.json')
const demos = JSON.parse(readFileSync(demosPath, 'utf8')) as DemoSummary[]

export const getDemos = () => demos

export const getDemoBySlug = (slug: string) => demos.find((demo) => demo.slug === slug)
