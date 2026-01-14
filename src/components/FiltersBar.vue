<template>
  <div class="flex flex-col gap-6 mb-8">
    <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
      <!-- Tabs -->
      <div class="flex gap-8">
        <button 
          @click="store.setFilterTab('today')"
          :class="[
            'pb-3 text-sm font-bold tracking-wide transition-colors',
            store.filter.tab === 'today'
              ? 'border-b-2 border-primary text-primary'
              : 'border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          ]"
        >
          Today
        </button>
        
        <button 
          @click="store.setFilterTab('all')"
          :class="[
            'pb-3 text-sm font-bold tracking-wide transition-colors',
            store.filter.tab === 'all'
              ? 'border-b-2 border-primary text-primary'
              : 'border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          ]"
        >
          All
        </button>
        
        <button 
          @click="store.setFilterTab('done')"
          :class="[
            'pb-3 text-sm font-bold tracking-wide transition-colors',
            store.filter.tab === 'done'
              ? 'border-b-2 border-primary text-primary'
              : 'border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          ]"
        >
          Done
        </button>
      </div>
      
      <button 
        v-if="hasDoneTasks"
        @click="handleClearDone"
        class="text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-widest pb-3"
      >
        Clear Done
      </button>
    </div>
    
    <!-- Search -->
    <div class="relative group">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">
        search
      </span>
      <input 
        ref="searchInputRef"
        v-model="store.filter.search"
        type="text" 
        class="w-full bg-white dark:bg-card-dark/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all shadow-sm"
        placeholder="Search tasks..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todo'

const store = useTodoStore()
const searchInputRef = ref<HTMLInputElement>()

const hasDoneTasks = computed(() => {
  return store.filteredTasks.some(t => t.done)
})

function handleClearDone() {
  const count = store.filteredTasks.filter(t => t.done).length
  if (confirm(`Clear ${count} completed task${count > 1 ? 's' : ''}?`)) {
    store.clearDoneTasks()
  }
}

// Keyboard shortcut: Cmd/Ctrl+K to focus search
function handleKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

defineExpose({
  focusSearch: () => searchInputRef.value?.focus()
})
</script>
