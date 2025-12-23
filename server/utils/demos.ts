import demosJson from '../../data/demos.json'

export type DemoSummary = {
  slug: string
  title: string
  description: string
  date: string
  category?: string
  legacyUrl: string
  legacyFile: string
}

const demos = demosJson as DemoSummary[]

export const getDemos = () => demos

export const getDemoBySlug = (slug: string) => demos.find((demo) => demo.slug === slug)
