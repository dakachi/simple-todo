<template>
  <aside class="w-64 flex flex-col bg-sidebar-dark border-r border-slate-800 shrink-0">
    <div class="p-6 flex flex-col h-full">
      <!-- Brand & Global Count -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-outlined text-primary text-3xl">check_circle</span>
          <h1 class="text-white text-xl font-bold tracking-tight">Todo.netlyze</h1>
        </div>
        <div class="flex items-center gap-2 px-1">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <p class="text-slate-400 text-xs font-medium uppercase tracking-wider">
            {{ store.todayTaskCount }} {{ store.todayTaskCount === 1 ? 'task' : 'tasks' }} remaining
          </p>
        </div>
      </div>
      
      <!-- Main Navigation -->
      <nav class="flex flex-col gap-1 mb-8">
        <button 
          @click="store.setFilterTab('today')"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
            store.filter.tab === 'today' 
              ? 'bg-primary/10 text-primary border border-primary/20' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          ]"
        >
          <span class="material-symbols-outlined text-[22px]">calendar_today</span>
          <p>Today</p>
        </button>
        
        <button 
          @click="store.setFilterTab('all')"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            store.filter.tab === 'all' 
              ? 'bg-primary/10 text-primary border border-primary/20' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          ]"
        >
          <span class="material-symbols-outlined text-[22px]">upcoming</span>
          <p>Upcoming</p>
        </button>
        
        <button 
          @click="store.setFilterTab('done')"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            store.filter.tab === 'done' 
              ? 'bg-primary/10 text-primary border border-primary/20' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          ]"
        >
          <span class="material-symbols-outlined text-[22px]">inventory_2</span>
          <p>Archive</p>
        </button>
      </nav>
      
      <!-- Categories -->
      <div class="flex flex-col gap-2">
        <p class="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
          Categories
        </p>
        
        <button 
          @click="store.setFilterCategory(null)"
          :class="[
            'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
            store.filter.categoryId === null 
              ? 'bg-slate-800/50' 
              : 'hover:bg-slate-800/30'
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <p class="text-slate-300 text-sm font-medium">All categories</p>
          </div>
          <span class="text-[10px] text-slate-600 font-bold group-hover:text-slate-400">
            {{ allTasksCount }}
          </span>
        </button>
        
        <button
          v-for="cat in store.categories"
          :key="cat.id"
          @click="store.setFilterCategory(cat.id)"
          :class="[
            'flex items-center justify-between px-3 py-2 group rounded-lg transition-colors',
            store.filter.categoryId === cat.id 
              ? 'bg-slate-800/50' 
              : 'hover:bg-slate-800/30'
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></span>
            <p class="text-slate-300 text-sm font-medium">{{ cat.name }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-600 font-bold group-hover:text-slate-400">
              {{ getCategoryCount(cat.id) }}
            </span>
            <div class="hidden group-hover:flex items-center gap-1">
              <button 
                @click.stop="editCategory(cat)"
                class="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                title="Edit"
              >
                <span class="material-symbols-outlined text-[14px]">edit</span>
              </button>
              <button 
                @click.stop="deleteCategory(cat.id, cat.name)"
                class="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                title="Delete"
              >
                <span class="material-symbols-outlined text-[14px]">delete</span>
              </button>
            </div>
          </div>
        </button>
        
        <button 
          @click="store.setFilterCategory('uncategorized')"
          :class="[
            'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
            store.filter.categoryId === 'uncategorized' 
              ? 'bg-slate-800/50' 
              : 'hover:bg-slate-800/30'
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <p class="text-slate-300 text-sm font-medium">Uncategorized</p>
          </div>
          <span class="text-[10px] text-slate-600 font-bold group-hover:text-slate-400">
            {{ uncategorizedCount }}
          </span>
        </button>
      </div>
      
      <!-- Footer Actions -->
      <div class="mt-auto pt-6 flex flex-col gap-3">
        <button 
          @click="showNewCategoryForm = true"
          class="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-colors"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          <span>New Category</span>
        </button>
        
        <div class="flex items-center gap-2">
          <button 
            @click="handleExport"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
            title="Export"
          >
            <span class="material-symbols-outlined text-[20px]">download</span>
          </button>
          <button 
            @click="triggerImport"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
            title="Import"
          >
            <span class="material-symbols-outlined text-[20px]">upload</span>
          </button>
          <button 
            @click="store.toggleDarkMode"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
            :title="`Switch to ${store.settings.darkMode ? 'light' : 'dark'} mode`"
          >
            <span class="material-symbols-outlined text-[20px]">
              {{ store.settings.darkMode ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <input 
      ref="fileInputRef" 
      type="file" 
      accept=".json"
      class="hidden"
      @change="handleImport"
    />
  </aside>
  
  <!-- Category Management Modal -->
  <teleport to="body">
    <div v-if="showNewCategoryForm" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style="z-index: 9999;" @click="closeNewCategoryForm">
      <div class="relative w-full max-w-[520px] bg-white dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <h2 class="text-xl font-bold tracking-tight">Manage Categories</h2>
          <button 
            @click="closeNewCategoryForm"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <!-- Scrollable Content Area -->
        <div class="max-h-[60vh] overflow-y-auto">
          <!-- Existing Categories List -->
          <div class="p-2" v-if="store.categories.length > 0">
            <div class="px-4 py-2">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Categories</p>
            </div>
            
            <div 
              v-for="cat in store.categories" 
              :key="cat.id"
              class="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-accent-dark/50 rounded-lg transition-colors group"
            >
              <div class="flex items-center gap-4">
                <div 
                  class="size-3 rounded-full shadow-lg"
                  :style="{ 
                    backgroundColor: cat.color,
                    boxShadow: `0 0 8px ${cat.color}80`
                  }"
                ></div>
                <p class="text-base font-medium">{{ cat.name }}</p>
              </div>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  @click="editCategory(cat)"
                  class="p-2 text-slate-400 hover:text-primary transition-colors"
                  title="Edit"
                >
                  <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button 
                  @click="deleteCategory(cat.id, cat.name)"
                  class="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Create New Section -->
          <div class="p-6 bg-slate-50 dark:bg-accent-dark/30 border-t border-slate-200 dark:border-slate-800">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4">Create New Category</h3>
            
            <div class="space-y-5">
              <!-- Category Name Input -->
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide" for="cat-name">
                  Category Name
                </label>
                <input 
                  id="cat-name"
                  ref="newCategoryInputRef"
                  v-model="newCategoryName" 
                  type="text" 
                  class="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="e.g. Shopping, Projects..."
                  @keydown.enter="createCategory"
                  @keydown.escape="closeNewCategoryForm"
                />
              </div>
              
              <!-- Color Picker Grid -->
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-2.5 uppercase tracking-wide">
                  Pick a label color
                </label>
                <div class="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  <button 
                    v-for="color in colorOptions" 
                    :key="color"
                    :class="[
                      'size-8 rounded-full transition-all',
                      newCategoryColor === color 
                        ? 'ring-2 ring-offset-2 dark:ring-offset-surface-dark scale-110' 
                        : 'hover:scale-110'
                    ]"
                    :style="{ 
                      backgroundColor: color,
                      ...(newCategoryColor === color ? { '--tw-ring-color': color } : {})
                    }"
                    @click="newCategoryColor = color"
                    :aria-label="`Select color ${color}`"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
          <button 
            @click="closeNewCategoryForm"
            class="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-accent-dark rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="createCategory"
            :disabled="!newCategoryName.trim()"
            class="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Category
          </button>
        </div>
      </div>
    </div>
    
    <!-- Edit Category Modal (Inline Edit Mode) -->
    <div v-if="editingCategory" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style="z-index: 9999;" @click="closeEditCategoryForm">
      <div class="relative w-full max-w-[520px] bg-white dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <h2 class="text-xl font-bold tracking-tight">Edit Category</h2>
          <button 
            @click="closeEditCategoryForm"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6 bg-slate-50 dark:bg-accent-dark/30">
          <div class="space-y-5">
            <!-- Category Name Input -->
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide" for="edit-cat-name">
                Category Name
              </label>
              <input 
                id="edit-cat-name"
                ref="editCategoryInputRef"
                v-model="editCategoryName" 
                type="text" 
                class="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="Category name"
                @keydown.enter="saveEditCategory"
                @keydown.escape="closeEditCategoryForm"
              />
            </div>
            
            <!-- Color Picker Grid -->
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-2.5 uppercase tracking-wide">
                Pick a label color
              </label>
              <div class="grid grid-cols-5 sm:grid-cols-10 gap-3">
                <button 
                  v-for="color in colorOptions" 
                  :key="color"
                  :class="[
                    'size-8 rounded-full transition-all',
                    editCategoryColor === color 
                      ? 'ring-2 ring-offset-2 dark:ring-offset-surface-dark scale-110' 
                      : 'hover:scale-110'
                  ]"
                  :style="{ 
                    backgroundColor: color,
                    ...(editCategoryColor === color ? { '--tw-ring-color': color } : {})
                  }"
                  @click="editCategoryColor = color"
                  :aria-label="`Select color ${color}`"
                ></button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
          <button 
            @click="closeEditCategoryForm"
            class="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-accent-dark rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="saveEditCategory"
            :disabled="!editCategoryName.trim()"
            class="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Category } from '@/types'
import { useTodoStore } from '@/stores/todo'
import { exportData, importData } from '@/utils/storage'

const store = useTodoStore()

const showNewCategoryForm = ref(false)
const newCategoryName = ref('')
const newCategoryColor = ref('#3b82f6')
const newCategoryInputRef = ref<HTMLInputElement>()

const editingCategory = ref<Category | null>(null)
const editCategoryName = ref('')
const editCategoryColor = ref('')
const editCategoryInputRef = ref<HTMLInputElement>()

const fileInputRef = ref<HTMLInputElement>()

const colorOptions = [
  '#ee8c2b', // primary orange
  '#f43f5e', // rose
  '#ec4899', // pink
  '#a855f7', // purple
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#14b8a6', // teal
  '#10b981', // emerald
  '#eab308', // yellow
]

const allTasksCount = computed(() => store.tasks.length)

const uncategorizedCount = computed(() => {
  return store.tasks.filter(t => t.categoryId === null).length
})

function getCategoryCount(categoryId: string): number {
  return store.tasks.filter(t => t.categoryId === categoryId).length
}

function closeNewCategoryForm() {
  showNewCategoryForm.value = false
  newCategoryName.value = ''
  newCategoryColor.value = '#3b82f6'
}

async function createCategory() {
  if (!newCategoryName.value.trim()) return
  
  store.addCategory(newCategoryName.value, newCategoryColor.value)
  closeNewCategoryForm()
}

function editCategory(cat: Category) {
  editingCategory.value = cat
  editCategoryName.value = cat.name
  editCategoryColor.value = cat.color
  
  nextTick(() => {
    editCategoryInputRef.value?.focus()
    editCategoryInputRef.value?.select()
  })
}

function closeEditCategoryForm() {
  editingCategory.value = null
  editCategoryName.value = ''
  editCategoryColor.value = ''
}

function saveEditCategory() {
  if (!editCategoryName.value.trim() || !editingCategory.value) return
  
  store.updateCategory(editingCategory.value.id, {
    name: editCategoryName.value.trim(),
    color: editCategoryColor.value
  })
  
  closeEditCategoryForm()
}

function deleteCategory(id: string, name: string) {
  if (confirm(`Delete category "${name}"? Tasks in this category will become uncategorized.`)) {
    store.deleteCategory(id)
  }
}

function handleExport() {
  const data = exportData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `netlyze-todo-backup-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function triggerImport() {
  fileInputRef.value?.click()
}

function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    const result = importData(content)
    
    if (result.success) {
      alert('Data imported successfully! Refreshing...')
      window.location.reload()
    } else {
      alert(`Import failed: ${result.error}`)
    }
  }
  reader.readAsText(file)
  
  target.value = ''
}
</script>
