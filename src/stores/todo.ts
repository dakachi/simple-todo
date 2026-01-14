import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, Category, Settings, FilterState } from '@/types'
import { 
  loadTasks, 
  saveTasks, 
  loadCategories, 
  saveCategories,
  loadSettings,
  saveSettings 
} from '@/utils/storage'
import { generateId } from '@/utils/id'
import { getTodayString, isToday, compareDates } from '@/utils/date'

export const useTodoStore = defineStore('todo', () => {
  // State
  const tasks = ref<Task[]>(loadTasks())
  const categories = ref<Category[]>(loadCategories())
  const settings = ref<Settings>(loadSettings())
  const filter = ref<FilterState>({
    tab: 'today',
    categoryId: null,
    search: ''
  })

  // Computed
  const filteredTasks = computed(() => {
    let result = tasks.value

    // Apply tab filter
    if (filter.value.tab === 'today') {
      result = result.filter(t => isToday(t.dueDate))
    } else if (filter.value.tab === 'done') {
      result = result.filter(t => t.done)
    }

    // Apply category filter
    if (filter.value.categoryId !== null) {
      if (filter.value.categoryId === 'uncategorized') {
        result = result.filter(t => t.categoryId === null)
      } else {
        result = result.filter(t => t.categoryId === filter.value.categoryId)
      }
    }

    // Apply search filter
    if (filter.value.search.trim()) {
      const searchLower = filter.value.search.toLowerCase().trim()
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchLower)
      )
    }

    // Sort
    if (filter.value.tab === 'today') {
      // Incomplete first, then done; within each group by updatedAt desc
      result = [...result].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1
        return b.updatedAt - a.updatedAt
      })
    } else {
      // Sort by updatedAt desc
      result = [...result].sort((a, b) => b.updatedAt - a.updatedAt)
    }

    return result
  })

  const tasksGroupedByCategory = computed(() => {
    const groups = new Map<string, Task[]>()
    
    filteredTasks.value.forEach(task => {
      const key = task.categoryId || 'uncategorized'
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(task)
    })
    
    return groups
  })

  const tasksGroupedByDate = computed(() => {
    const groups = new Map<string, Task[]>()
    
    filteredTasks.value.forEach(task => {
      if (!groups.has(task.dueDate)) {
        groups.set(task.dueDate, [])
      }
      groups.get(task.dueDate)!.push(task)
    })
    
    // Sort dates
    const sortedDates = Array.from(groups.keys()).sort(compareDates)
    const sortedGroups = new Map<string, Task[]>()
    sortedDates.forEach(date => {
      sortedGroups.set(date, groups.get(date)!)
    })
    
    return sortedGroups
  })

  const todayTaskCount = computed(() => {
    return tasks.value.filter(t => isToday(t.dueDate) && !t.done).length
  })

  const categoryById = computed(() => {
    const map = new Map<string, Category>()
    categories.value.forEach(cat => map.set(cat.id, cat))
    return map
  })

  // Actions - Tasks
  function addTask(title: string, categoryId: string | null = null, dueDate: string = getTodayString()) {
    // If categoryId is explicitly null, use null. Otherwise use provided categoryId or fall back to lastUsedCategoryId
    const finalCategoryId = categoryId === null 
      ? null 
      : (categoryId || settings.value.lastUsedCategoryId)
    
    const task: Task = {
      id: generateId(),
      title: title.trim(),
      done: false,
      categoryId: finalCategoryId,
      dueDate,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    tasks.value.push(task)
    saveTasks(tasks.value)
    
    // Update last used category (only if a category was selected)
    if (task.categoryId) {
      settings.value.lastUsedCategoryId = task.categoryId
      saveSettings(settings.value)
    }
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    
    Object.assign(task, updates, { updatedAt: Date.now() })
    saveTasks(tasks.value)
  }

  function toggleTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    
    task.done = !task.done
    task.updatedAt = Date.now()
    saveTasks(tasks.value)
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    saveTasks(tasks.value, true)
  }

  function clearDoneTasks() {
    // Only clear tasks that match current filter
    const idsToDelete = new Set(
      filteredTasks.value.filter(t => t.done).map(t => t.id)
    )
    
    tasks.value = tasks.value.filter(t => !idsToDelete.has(t.id))
    saveTasks(tasks.value, true)
  }

  // Actions - Categories
  function addCategory(name: string, color: string) {
    const category: Category = {
      id: generateId(),
      name: name.trim(),
      color,
      createdAt: Date.now()
    }
    
    categories.value.push(category)
    saveCategories(categories.value)
    return category
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    const category = categories.value.find(c => c.id === id)
    if (!category) return
    
    Object.assign(category, updates)
    saveCategories(categories.value)
  }

  function deleteCategory(id: string) {
    // Set categoryId to null for all tasks in this category
    tasks.value.forEach(task => {
      if (task.categoryId === id) {
        task.categoryId = null
        task.updatedAt = Date.now()
      }
    })
    
    categories.value = categories.value.filter(c => c.id !== id)
    
    saveTasks(tasks.value, true)
    saveCategories(categories.value, true)
    
    // Clear from settings if it was the last used
    if (settings.value.lastUsedCategoryId === id) {
      settings.value.lastUsedCategoryId = null
      saveSettings(settings.value)
    }
  }

  // Actions - Filters
  function setFilterTab(tab: FilterState['tab']) {
    filter.value.tab = tab
  }

  function setFilterCategory(categoryId: string | null) {
    filter.value.categoryId = categoryId
  }

  function setFilterSearch(search: string) {
    filter.value.search = search
  }

  function clearFilters() {
    filter.value = {
      tab: 'today',
      categoryId: null,
      search: ''
    }
  }

  // Actions - Settings
  function toggleDarkMode() {
    const newDarkMode = !settings.value.darkMode
    // Create a new object to ensure reactivity
    settings.value = {
      ...settings.value,
      darkMode: newDarkMode
    }
    saveSettings(settings.value)
  }

  function setLastUsedCategory(categoryId: string | null) {
    settings.value.lastUsedCategoryId = categoryId
    saveSettings(settings.value)
  }

  return {
    // State
    tasks,
    categories,
    settings,
    filter,
    
    // Computed
    filteredTasks,
    tasksGroupedByCategory,
    tasksGroupedByDate,
    todayTaskCount,
    categoryById,
    
    // Actions
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearDoneTasks,
    addCategory,
    updateCategory,
    deleteCategory,
    setFilterTab,
    setFilterCategory,
    setFilterSearch,
    clearFilters,
    toggleDarkMode,
    setLastUsedCategory
  }
})
