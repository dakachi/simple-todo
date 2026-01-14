<template>
  <!-- Match sample Filters & Search Bar -->
  <div class="flex flex-col gap-6 mb-8">
    <div class="flex items-center justify-between border-b border-border-soft dark:border-slate-800">
      <!-- Tabs -->
      <div class="flex gap-8">
        <a
          href="#"
          :class="store.filter.tab === 'today'
            ? 'border-b-2 border-primary text-primary pb-3 text-sm font-bold tracking-wide'
            : 'border-b-2 border-transparent text-text-secondary dark:text-slate-400 pb-3 text-sm font-bold tracking-wide hover:text-text-main dark:hover:text-slate-200 transition-colors'"
          @click.prevent="store.setFilterTab('today')"
        >Today</a>
        <a
          href="#"
          :class="store.filter.tab === 'all'
            ? 'border-b-2 border-primary text-primary pb-3 text-sm font-bold tracking-wide'
            : 'border-b-2 border-transparent text-text-secondary dark:text-slate-400 pb-3 text-sm font-bold tracking-wide hover:text-text-main dark:hover:text-slate-200 transition-colors'"
          @click.prevent="store.setFilterTab('all')"
        >All</a>
        <a
          href="#"
          :class="store.filter.tab === 'done'
            ? 'border-b-2 border-primary text-primary pb-3 text-sm font-bold tracking-wide'
            : 'border-b-2 border-transparent text-text-secondary dark:text-slate-400 pb-3 text-sm font-bold tracking-wide hover:text-text-main dark:hover:text-slate-200 transition-colors'"
          @click.prevent="store.setFilterTab('done')"
        >Done</a>
      </div>

      <button
        v-if="hasDoneTasks"
        @click="handleClearDone"
        class="text-xs font-bold text-text-secondary dark:text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-widest pb-3"
      >
        Clear Done
      </button>
    </div>

    <!-- Search -->
    <div class="relative group">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary dark:text-slate-500 group-focus-within:text-primary transition-colors">search</span>
      <input
        ref="searchInputRef"
        v-model="store.filter.search"
        class="w-full bg-background-card dark:bg-card-dark/50 border border-border-soft dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all shadow-sm text-text-main dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400"
        placeholder="Search tasks..."
        type="text"
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
