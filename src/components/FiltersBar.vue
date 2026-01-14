<template>
  <div class="filters-bar">
    <div class="tabs">
      <button 
        class="tab"
        :class="{ active: store.filter.tab === 'today' }"
        @click="store.setFilterTab('today')"
      >
        Today
      </button>
      <button 
        class="tab"
        :class="{ active: store.filter.tab === 'all' }"
        @click="store.setFilterTab('all')"
      >
        All
      </button>
      <button 
        class="tab"
        :class="{ active: store.filter.tab === 'done' }"
        @click="store.setFilterTab('done')"
      >
        Done
      </button>
    </div>
    
    <div class="filters-right">
      <input
        ref="searchInputRef"
        v-model="store.filter.search"
        type="text"
        class="search-input"
        placeholder="Search tasks..."
        aria-label="Search tasks"
      />
      
      <button 
        v-if="hasDoneTasks"
        class="clear-done-btn" 
        @click="handleClearDone"
        title="Clear completed tasks"
      >
        Clear Done
      </button>
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

<style scoped>
.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  background: var(--card-bg);
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.tab {
  padding: 0.6rem 1.25rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--text);
  background: var(--hover-bg);
}

.tab.active {
  background: var(--primary);
  color: white;
}

.filters-right {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-input {
  padding: 0.6rem 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.9rem;
  background: var(--input-bg);
  color: var(--text);
  min-width: 200px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.clear-done-btn {
  padding: 0.6rem 1rem;
  background: var(--danger-light);
  color: var(--danger);
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.clear-done-btn:hover {
  background: var(--danger);
  color: white;
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .tabs {
    width: 100%;
  }
  
  .tab {
    flex: 1;
  }
  
  .filters-right {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
    min-width: 0;
  }
  
  .clear-done-btn {
    width: 100%;
  }
}
</style>
