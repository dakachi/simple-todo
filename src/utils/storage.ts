import type { Task, Category, Settings } from '@/types'

const TASKS_KEY = 'starporter.todo.tasks.v1'
const CATEGORIES_KEY = 'starporter.todo.categories.v1'
const SETTINGS_KEY = 'starporter.todo.settings.v1'

let writeTimeout: number | null = null
const DEBOUNCE_DELAY = 250

function safeJSONParse<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    return JSON.parse(item) as T
  } catch (e) {
    return defaultValue
  }
}

export function loadTasks(): Task[] {
  const tasks = safeJSONParse<Task[]>(TASKS_KEY, [])
  
  // Validate structure
  if (!Array.isArray(tasks)) return []
  
  return tasks.filter(task => {
    return (
      typeof task.id === 'string' &&
      typeof task.title === 'string' &&
      typeof task.done === 'boolean' &&
      (task.categoryId === null || typeof task.categoryId === 'string') &&
      typeof task.dueDate === 'string' &&
      typeof task.createdAt === 'number' &&
      typeof task.updatedAt === 'number'
    )
  })
}

export function saveTasks(tasks: Task[], immediate = false): void {
  const save = () => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    } catch (e) {
      console.error('Failed to save tasks:', e)
    }
  }
  
  if (immediate) {
    if (writeTimeout) clearTimeout(writeTimeout)
    save()
  } else {
    if (writeTimeout) clearTimeout(writeTimeout)
    writeTimeout = window.setTimeout(save, DEBOUNCE_DELAY)
  }
}

export function loadCategories(): Category[] {
  const categories = safeJSONParse<Category[]>(CATEGORIES_KEY, [])
  
  if (!Array.isArray(categories)) return []
  
  return categories.filter(cat => {
    return (
      typeof cat.id === 'string' &&
      typeof cat.name === 'string' &&
      typeof cat.color === 'string' &&
      typeof cat.createdAt === 'number'
    )
  })
}

export function saveCategories(categories: Category[], immediate = false): void {
  const save = () => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    } catch (e) {
      console.error('Failed to save categories:', e)
    }
  }
  
  if (immediate) {
    if (writeTimeout) clearTimeout(writeTimeout)
    save()
  } else {
    if (writeTimeout) clearTimeout(writeTimeout)
    writeTimeout = window.setTimeout(save, DEBOUNCE_DELAY)
  }
}

export function loadSettings(): Settings {
  const defaultSettings: Settings = {
    lastUsedCategoryId: null,
    darkMode: false // Default to light mode
  }
  
  const settings = safeJSONParse<Settings>(SETTINGS_KEY, defaultSettings)
  
  // Ensure darkMode defaults to false (light mode) if not set
  return {
    lastUsedCategoryId: settings.lastUsedCategoryId || null,
    darkMode: settings.darkMode !== undefined ? settings.darkMode : false
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

export function exportData(): string {
  return JSON.stringify({
    tasks: loadTasks(),
    categories: loadCategories(),
    settings: loadSettings(),
    exportedAt: Date.now()
  }, null, 2)
}

export function importData(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString)
    
    if (data.tasks && Array.isArray(data.tasks)) {
      saveTasks(data.tasks, true)
    }
    
    if (data.categories && Array.isArray(data.categories)) {
      saveCategories(data.categories, true)
    }
    
    if (data.settings) {
      saveSettings(data.settings)
    }
    
    return { success: true }
  } catch (e) {
    return { 
      success: false, 
      error: e instanceof Error ? e.message : 'Invalid JSON' 
    }
  }
}
