<template>
  <!-- Match sample SideNavBar markup/classes -->
  <aside class="w-64 flex flex-col bg-sidebar-dark border-r border-slate-800 shrink-0">
    <div class="p-6 flex flex-col h-full">
      <!-- Brand & Global Count -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-outlined text-primary text-3xl">check_circle</span>
          <h1 class="text-white text-xl font-bold tracking-tight">Starporter.dev</h1>
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
        <div
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
          :class="store.filter.tab === 'today'
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'"
          @click="store.setFilterTab('today')"
        >
          <span class="material-symbols-outlined text-[22px]">calendar_today</span>
          <p class="text-sm font-semibold">Today</p>
        </div>
        <div
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
          :class="store.filter.tab === 'all'
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'"
          @click="store.setFilterTab('all')"
        >
          <span class="material-symbols-outlined text-[22px]">upcoming</span>
          <p class="text-sm font-medium">Upcoming</p>
        </div>
        <div
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
          :class="store.filter.tab === 'done'
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'"
          @click="store.setFilterTab('done')"
        >
          <span class="material-symbols-outlined text-[22px]">inventory_2</span>
          <p class="text-sm font-medium">Archive</p>
        </div>
      </nav>

      <!-- Categories -->
      <div class="flex flex-col gap-2">
        <p class="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Categories</p>

        <div
          v-for="cat in store.categories"
          :key="cat.id"
          class="flex items-center justify-between px-3 py-2 group cursor-pointer hover:bg-slate-800/30 rounded-lg"
          @click="selectCategoryForTask(cat.id)"
        >
          <div class="flex items-center gap-3">
            <span
              class="w-2.5 h-2.5 rounded-full"
              :class="categoryDotClass(cat.color)"
              :style="categoryDotStyle(cat.color)"
            ></span>
            <p class="text-slate-300 text-sm font-medium">{{ cat.name }}</p>
          </div>
          <span class="text-[10px] text-slate-600 font-bold group-hover:text-slate-400">{{ getCategoryCount(cat.id) }}</span>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="mt-auto pt-6 flex flex-col gap-3">
        <button
          class="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-colors"
          @click="showNewCategoryForm = true"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          <span>New Category</span>
        </button>

        <div class="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white cursor-pointer" @click="showSettings = true">
          <span class="material-symbols-outlined text-[20px]">settings</span>
          <p class="text-sm font-medium">Settings</p>
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

  <!-- Settings (minimal, keeps extra actions without changing sidebar layout) -->
  <teleport to="body">
    <div v-if="showSettings" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style="z-index: 9999;" @click="showSettings = false">
      <div class="relative w-full max-w-[520px] bg-white dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <h2 class="text-xl font-bold tracking-tight">Settings</h2>
          <button class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" @click="showSettings = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-6 space-y-3 bg-slate-50 dark:bg-accent-dark/30">
          <button class="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/70 dark:bg-background-dark/50 border border-slate-200 dark:border-slate-700 hover:border-primary/40 transition-colors" @click="handleExport">
            <span class="text-sm font-semibold">Export JSON</span>
            <span class="material-symbols-outlined text-slate-400">download</span>
          </button>
          <button class="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/70 dark:bg-background-dark/50 border border-slate-200 dark:border-slate-700 hover:border-primary/40 transition-colors" @click="triggerImport">
            <span class="text-sm font-semibold">Import JSON</span>
            <span class="material-symbols-outlined text-slate-400">upload</span>
          </button>
          <button class="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/70 dark:bg-background-dark/50 border border-slate-200 dark:border-slate-700 hover:border-primary/40 transition-colors" @click="store.toggleDarkMode">
            <span class="text-sm font-semibold">{{ store.settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</span>
            <span class="material-symbols-outlined text-slate-400">{{ store.settings.darkMode ? 'light_mode' : 'dark_mode' }}</span>
          </button>
        </div>
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
          <button class="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-accent-dark rounded-lg transition-colors" @click="showSettings = false">Close</button>
        </div>
      </div>
    </div>
  </teleport>
  
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
const showSettings = ref(false)
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

function categoryDotClass(color: string): string {
  const c = color.toLowerCase()
  const map: Record<string, string> = {
    '#3b82f6': 'bg-blue-500',
    '#ee8c2b': 'bg-primary',
    '#14b8a6': 'bg-teal-500',
    '#10b981': 'bg-emerald-500',
    '#f43f5e': 'bg-rose-500',
    '#6366f1': 'bg-indigo-500',
    '#06b6d4': 'bg-cyan-500',
    '#eab308': 'bg-yellow-500',
    '#a855f7': 'bg-purple-500',
    '#ec4899': 'bg-pink-500',
  }
  return map[c] || ''
}

function categoryDotStyle(color: string): Record<string, string> {
  return categoryDotClass(color) ? {} : { backgroundColor: color }
}

function getCategoryCount(categoryId: string): number {
  return store.tasks.filter(t => t.categoryId === categoryId).length
}

function selectCategoryForTask(categoryId: string) {
  // Set filter to show tasks in this category
  store.setFilterCategory(categoryId)
  // Also select this category for task creation
  store.setLastUsedCategory(categoryId)
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
  a.download = `starporter-todo-backup-${Date.now()}.json`
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
