<template>
  <div class="mb-10">
    <div class="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
      <div class="flex items-start p-4 gap-4">
        <div class="mt-2 h-10 w-10 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
          <span class="material-symbols-outlined text-slate-500">person</span>
        </div>
        
        <div class="flex-1 flex flex-col">
          <textarea 
            ref="inputRef"
            v-model="title" 
            class="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-lg font-medium resize-none h-12 pt-1"
            placeholder="What's on your mind?"
            @keydown.enter.prevent="handleAdd"
            @keydown.escape="handleEscape"
          ></textarea>
          
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-2">
              <div class="relative" ref="categoryPickerRef">
                <button 
                  type="button"
                  @click="toggleCategoryPicker"
                  @mousedown.stop
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">label</span>
                  <span class="text-xs font-bold uppercase tracking-wider">
                    {{ selectedCategoryName }}
                  </span>
                </button>
                
                <!-- Category Picker Dropdown -->
                <div 
                  v-if="showCategoryPicker"
                  @click.stop
                  class="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-[100] py-2"
                >
                    <button
                      type="button"
                      @click.stop="selectCategory(null)"
                      class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                      <span>No category</span>
                    </button>
                    <button
                      v-for="cat in store.categories"
                      :key="cat.id"
                      type="button"
                      @click.stop="selectCategory(cat.id)"
                      class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></span>
                      <span>{{ cat.name }}</span>
                    </button>
                  </div>
              </div>
              
              <button class="p-1.5 text-slate-400 hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-lg">calendar_month</span>
              </button>
              
              <button class="p-1.5 text-slate-400 hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-lg">flag</span>
              </button>
            </div>
            
            <button 
              @click="handleAdd"
              :disabled="!title.trim()"
              class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { getTodayString } from '@/utils/date'

const store = useTodoStore()
const title = ref('')
const selectedCategoryId = ref<string | null>(store.settings.lastUsedCategoryId)
const inputRef = ref<HTMLTextAreaElement>()
const categoryPickerRef = ref<HTMLDivElement>()
const showCategoryPicker = ref(false)

// Watch for changes to lastUsedCategoryId from sidebar selection
watch(() => store.settings.lastUsedCategoryId, (newCategoryId) => {
  selectedCategoryId.value = newCategoryId
})

const selectedCategoryName = computed(() => {
  if (selectedCategoryId.value === null) return 'Category'
  const category = store.categoryById.get(selectedCategoryId.value)
  return category?.name || 'Category'
})

function toggleCategoryPicker() {
  showCategoryPicker.value = !showCategoryPicker.value
}

function selectCategory(categoryId: string | null) {
  selectedCategoryId.value = categoryId
  showCategoryPicker.value = false
}

function handleAdd() {
  if (!title.value.trim()) return
  
  // Pass the selected category (can be null for "No category")
  store.addTask(title.value, selectedCategoryId.value, getTodayString())
  
  // Clear only the title, keep the selected category for next task
  title.value = ''
  
  // Update last used category in settings (only if a category was selected)
  if (selectedCategoryId.value) {
    store.setLastUsedCategory(selectedCategoryId.value)
  }
}

function handleEscape() {
  title.value = ''
  inputRef.value?.blur()
}

function handleClickOutside(event: MouseEvent) {
  if (!showCategoryPicker.value) return
  
  const target = event.target as HTMLElement
  // Check if click is outside the category picker container
  if (categoryPickerRef.value && !categoryPickerRef.value.contains(target)) {
    showCategoryPicker.value = false
  }
}

onMounted(() => {
  // Delay adding the listener to avoid conflicts
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 200)
  inputRef.value?.focus()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({
  focus: () => inputRef.value?.focus()
})
</script>
