export interface Task {
  id: string
  title: string
  done: boolean
  categoryId: string | null
  dueDate: string // YYYY-MM-DD
  createdAt: number
  updatedAt: number
}

export interface Category {
  id: string
  name: string
  color: string // hex color
  createdAt: number
}

export interface Settings {
  lastUsedCategoryId: string | null
  darkMode: boolean
}

export type FilterTab = 'today' | 'all' | 'done'

export interface FilterState {
  tab: FilterTab
  categoryId: string | null // null means "All categories"
  search: string
}
