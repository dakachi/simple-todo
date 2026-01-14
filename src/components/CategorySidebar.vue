<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="app-title">Netlyze Todo</h1>
      <button 
        class="theme-toggle" 
        @click="store.toggleDarkMode"
        :aria-label="`Switch to ${store.settings.darkMode ? 'light' : 'dark'} mode`"
        title="Toggle theme"
      >
        <svg v-if="store.settings.darkMode" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        </svg>
      </button>
    </div>
    
    <div class="today-count">
      <span class="count-label">Today</span>
      <span class="count-value">{{ store.todayTaskCount }}</span>
    </div>
    
    <nav class="categories-section">
      <h2 class="section-title">Categories</h2>
      
      <ul class="category-list">
        <li>
          <button 
            class="category-item" 
            :class="{ active: store.filter.categoryId === null }"
            @click="store.setFilterCategory(null)"
          >
            <span class="category-dot" style="background: #999;"></span>
            <span class="category-name">All categories</span>
            <span class="category-count">{{ allTasksCount }}</span>
          </button>
        </li>
        
        <li v-for="cat in store.categories" :key="cat.id">
          <button 
            class="category-item" 
            :class="{ active: store.filter.categoryId === cat.id }"
            @click="store.setFilterCategory(cat.id)"
          >
            <span class="category-dot" :style="{ background: cat.color }"></span>
            <span class="category-name">{{ cat.name }}</span>
            <span class="category-count">{{ getCategoryCount(cat.id) }}</span>
            
            <div class="category-actions">
              <button 
                class="category-action-btn"
                @click.stop="editCategory(cat)"
                aria-label="Edit category"
                title="Edit"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.146 1.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-9 9a.5.5 0 0 1-.168.11l-4 1.5a.5.5 0 0 1-.65-.65l1.5-4a.5.5 0 0 1 .11-.168l9-9z"/>
                </svg>
              </button>
              <button 
                class="category-action-btn delete"
                @click.stop="deleteCategory(cat.id, cat.name)"
                aria-label="Delete category"
                title="Delete"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1z"/>
                </svg>
              </button>
            </div>
          </button>
        </li>
        
        <li>
          <button 
            class="category-item" 
            :class="{ active: store.filter.categoryId === 'uncategorized' }"
            @click="store.setFilterCategory('uncategorized')"
          >
            <span class="category-dot" style="background: #ccc;"></span>
            <span class="category-name">Uncategorized</span>
            <span class="category-count">{{ uncategorizedCount }}</span>
          </button>
        </li>
      </ul>
      
      <button class="new-category-btn" @click="showNewCategoryForm = true">
        <span class="plus-icon">+</span>
        New Category
      </button>
    </nav>
    
    <div class="sidebar-footer">
      <button class="export-btn" @click="handleExport" title="Export data">
        Export
      </button>
      <button class="import-btn" @click="triggerImport" title="Import data">
        Import
      </button>
      <input 
        ref="fileInputRef" 
        type="file" 
        accept=".json"
        style="display: none"
        @change="handleImport"
      />
    </div>
  </aside>
  
  <!-- New Category Modal -->
  <div v-if="showNewCategoryForm" class="modal-overlay" @click="closeNewCategoryForm">
    <div class="modal" @click.stop>
      <h3 class="modal-title">New Category</h3>
      
      <div class="form-group">
        <label for="cat-name">Name</label>
        <input 
          id="cat-name"
          ref="newCategoryInputRef"
          v-model="newCategoryName" 
          type="text" 
          class="form-input"
          placeholder="Category name"
          @keydown.enter="createCategory"
          @keydown.escape="closeNewCategoryForm"
        />
      </div>
      
      <div class="form-group">
        <label>Color</label>
        <div class="color-picker">
          <button 
            v-for="color in colorOptions" 
            :key="color"
            class="color-option"
            :class="{ selected: newCategoryColor === color }"
            :style="{ background: color }"
            @click="newCategoryColor = color"
            :aria-label="`Select color ${color}`"
          ></button>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="closeNewCategoryForm">
          Cancel
        </button>
        <button 
          class="btn btn-primary" 
          @click="createCategory"
          :disabled="!newCategoryName.trim()"
        >
          Create
        </button>
      </div>
    </div>
  </div>
  
  <!-- Edit Category Modal -->
  <div v-if="editingCategory" class="modal-overlay" @click="closeEditCategoryForm">
    <div class="modal" @click.stop>
      <h3 class="modal-title">Edit Category</h3>
      
      <div class="form-group">
        <label for="edit-cat-name">Name</label>
        <input 
          id="edit-cat-name"
          ref="editCategoryInputRef"
          v-model="editCategoryName" 
          type="text" 
          class="form-input"
          placeholder="Category name"
          @keydown.enter="saveEditCategory"
          @keydown.escape="closeEditCategoryForm"
        />
      </div>
      
      <div class="form-group">
        <label>Color</label>
        <div class="color-picker">
          <button 
            v-for="color in colorOptions" 
            :key="color"
            class="color-option"
            :class="{ selected: editCategoryColor === color }"
            :style="{ background: color }"
            @click="editCategoryColor = color"
            :aria-label="`Select color ${color}`"
          ></button>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="closeEditCategoryForm">
          Cancel
        </button>
        <button 
          class="btn btn-primary" 
          @click="saveEditCategory"
          :disabled="!editCategoryName.trim()"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Category } from '@/types'
import { useTodoStore } from '@/stores/todo'
import { exportData, importData } from '@/utils/storage'

const store = useTodoStore()

const showNewCategoryForm = ref(false)
const newCategoryName = ref('')
const newCategoryColor = ref('#6366f1')
const newCategoryInputRef = ref<HTMLInputElement>()

const editingCategory = ref<Category | null>(null)
const editCategoryName = ref('')
const editCategoryColor = ref('')
const editCategoryInputRef = ref<HTMLInputElement>()

const fileInputRef = ref<HTMLInputElement>()

const colorOptions = [
  '#ef4444', // red
  '#f59e0b', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // gray
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
  newCategoryColor.value = '#6366f1'
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
  
  // Reset input
  target.value = ''
}

// Auto-focus when modal opens
nextTick(() => {
  if (showNewCategoryForm.value) {
    newCategoryInputRef.value?.focus()
  }
})
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.theme-toggle {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: var(--hover-bg);
}

.today-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--primary-light);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.count-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
}

.count-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.categories-section {
  flex: 1;
}

.section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.category-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  color: var(--text);
}

.category-item:hover {
  background: var(--hover-bg);
}

.category-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-name {
  flex: 1;
  font-size: 0.9rem;
}

.category-count {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.category-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-item:hover .category-actions {
  opacity: 1;
}

.category-action-btn {
  padding: 0.25rem;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-action-btn:hover {
  background: var(--hover-bg);
  color: var(--text);
}

.category-action-btn.delete:hover {
  color: var(--danger);
}

.new-category-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--card-bg);
  border: 2px dashed var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  font-weight: 500;
}

.new-category-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.plus-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.sidebar-footer {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.export-btn,
.import-btn {
  flex: 1;
  padding: 0.6rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.export-btn:hover,
.import-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modal {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.2s;
}

.modal-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: var(--text);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text);
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  width: 36px;
  height: 36px;
  border: 3px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: var(--text);
  box-shadow: 0 0 0 2px var(--card-bg);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--hover-bg);
  color: var(--text);
}

.btn-secondary:hover {
  background: var(--border);
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  
  .category-actions {
    opacity: 1;
  }
}
</style>
