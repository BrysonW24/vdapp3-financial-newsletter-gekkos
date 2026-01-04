export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: 'market' | 'indicator' | 'strategy' | 'instrument' | 'general'
  relatedTerms: string[]
  example?: string
  externalLinks?: Array<{ text: string; url: string }>
  liveDataExample?: boolean
}

export interface EducationSection {
  id: string
  title: string
  icon: string
  description: string
  content: EducationContent[]
}

export interface EducationContent {
  heading: string
  body: string
  type: 'text' | 'list' | 'table' | 'callout'
  visualAid?: 'chart' | 'diagram' | 'timeline'
  relatedTerms?: string[]
  externalLinks?: Array<{ text: string; url: string }>
}

export interface SectionInfo {
  id: string
  title: string
  description: string
  icon: string
  color: string
  path: string
}
