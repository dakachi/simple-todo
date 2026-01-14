<template>
  <div class="task-composer">
    <div class="composer-row">
      <input
        ref="inputRef"
        v-model="title"
        type="text"
        class="task-input"
        placeholder="Add a task... (press Enter)"
        @keydown.enter="handleAdd"
        @keydown.escape="handleEscape"
      />
      
      <select 
        v-model="selectedCategoryId" 
        class="category-select"
        aria-label="Select category"
      >
        <option :value="null">No category</option>
        <option 
          v-for="cat in store.categories" 
          :key="cat.id" 
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>
      
      <button 
        class="add-button" 
        @click="handleAdd"
        :disabled="!title.trim()"
        aria-label="Add task"
      >
        <span class="add-icon">+</span>
        Add
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { getTodayString } from '@/utils/date'

const store = useTodoStore()
const title = ref('')
const selectedCategoryId = ref<string | null>(store.settings.lastUsedCategoryId)
const inputRef = ref<HTMLInputElement>()

function handleAdd() {
  if (!title.value.trim()) return
  
  store.addTask(title.value, selectedCategoryId.value, getTodayString())
  title.value = ''
  
  // Update selected category for next task
  if (selectedCategoryId.value) {
    store.setLastUsedCategory(selectedCategoryId.value)
  }
}

function handleEscape() {
  title.value = ''
  inputRef.value?.blur()
}

// Focus input on mount
onMounted(() => {
  inputRef.value?.focus()
})

// Export focus method for keyboard shortcuts
defineExpose({
  focus: () => inputRef.value?.focus()
})
</script>

<style scoped>
.task-composer {
  margin-bottom: 1.5rem;
}

.composer-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.task-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: var(--input-bg);
  color: var(--text);
}

.task-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.category-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--input-bg);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 150px;
}

.category-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-button:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-icon {
  font-size: 1.25rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .composer-row {
    flex-direction: column;
  }
  
  .task-input,
  .category-select,
  .add-button {
    width: 100%;
  }
}
</style>
