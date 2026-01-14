<template>
  <div class="task-item" :class="{ done: task.done }">
    <input
      type="checkbox"
      :checked="task.done"
      @change="store.toggleTask(task.id)"
      class="task-checkbox"
      :aria-label="`Mark ${task.title} as ${task.done ? 'incomplete' : 'complete'}`"
    />
    
    <div class="task-content" @dblclick="startEdit">
      <input
        v-if="isEditing"
        ref="editInputRef"
        v-model="editTitle"
        type="text"
        class="task-edit-input"
        @keydown.enter="saveEdit"
        @keydown.escape="cancelEdit"
        @blur="saveEdit"
      />
      <span v-else class="task-title">{{ task.title }}</span>
      
      <div class="task-meta">
        <span v-if="category" class="task-category">
          <span class="category-dot" :style="{ backgroundColor: category.color }"></span>
          {{ category.name }}
        </span>
        <span v-if="!isToday(task.dueDate)" class="task-date">
          {{ formatDate(task.dueDate) }}
        </span>
      </div>
    </div>
    
    <div class="task-actions">
      <button
        v-if="!isEditing"
        class="task-action-btn"
        @click="startEdit"
        aria-label="Edit task"
        title="Edit"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12.146 1.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-9 9a.5.5 0 0 1-.168.11l-4 1.5a.5.5 0 0 1-.65-.65l1.5-4a.5.5 0 0 1 .11-.168l9-9zM11.5 2.5L13.5 4.5 12 6 10 4 11.5 2.5z"/>
        </svg>
      </button>
      
      <button
        class="task-action-btn delete"
        @click="handleDelete"
        aria-label="Delete task"
        title="Delete"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Task } from '@/types'
import { useTodoStore } from '@/stores/todo'
import { formatDate, isToday } from '@/utils/date'

const props = defineProps<{
  task: Task
}>()

const store = useTodoStore()
const isEditing = ref(false)
const editTitle = ref('')
const editInputRef = ref<HTMLInputElement>()

const category = computed(() => {
  if (!props.task.categoryId) return null
  return store.categoryById.get(props.task.categoryId)
})

function startEdit() {
  editTitle.value = props.task.title
  isEditing.value = true
  nextTick(() => {
    editInputRef.value?.focus()
    editInputRef.value?.select()
  })
}

function saveEdit() {
  if (!editTitle.value.trim()) {
    cancelEdit()
    return
  }
  
  store.updateTask(props.task.id, { title: editTitle.value.trim() })
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
  editTitle.value = ''
}

function handleDelete() {
  if (confirm(`Delete task "${props.task.title}"?`)) {
    store.deleteTask(props.task.id)
  }
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: all 0.2s;
}

.task-item:hover {
  border-color: var(--border-hover);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.task-item.done {
  opacity: 0.6;
}

.task-item.done .task-title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-checkbox {
  margin-top: 0.2rem;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  flex-shrink: 0;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  display: block;
  font-size: 1rem;
  color: var(--text);
  margin-bottom: 0.25rem;
  word-wrap: break-word;
}

.task-edit-input {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border: 2px solid var(--primary);
  border-radius: 4px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text);
}

.task-edit-input:focus {
  outline: none;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.task-category {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-item:hover .task-actions {
  opacity: 1;
}

.task-action-btn {
  padding: 0.4rem;
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

.task-action-btn:hover {
  background: var(--hover-bg);
  color: var(--text);
}

.task-action-btn.delete:hover {
  color: var(--danger);
  background: var(--danger-light);
}

@media (max-width: 768px) {
  .task-actions {
    opacity: 1;
  }
}
</style>
