<template>
  <!-- Match sample Task Row markup/classes -->
  <div class="task-row flex items-center justify-between p-4 bg-background-card dark:bg-card-dark/40 border border-border-soft dark:border-slate-800/50 rounded-xl hover:border-accent/30 dark:hover:border-primary/30 hover:bg-background-card dark:hover:bg-card-dark transition-all group cursor-default">
    <div class="flex items-center gap-4">
      <div class="relative flex items-center justify-center w-6 h-6 rounded-md border-2 border-accent/30 dark:border-slate-700 group-hover:border-accent dark:group-hover:border-primary transition-colors cursor-pointer">
        <input 
          type="checkbox" 
          :checked="task.done"
          @change="store.toggleTask(task.id)"
          class="opacity-0 absolute inset-0 cursor-pointer z-10"
        />
        <span :class="checkIconClass">check</span>
      </div>
      
      <div class="flex flex-col">
        <input
          v-if="isEditing"
          ref="editInputRef"
          v-model="editTitle"
          type="text"
          class="bg-transparent border-none focus:ring-0 p-0 text-text-main dark:text-slate-100 font-medium text-base"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
          @blur="saveEdit"
        />
        <p 
          v-else
          @dblclick="startEdit"
          :class="[
            'font-medium',
            task.done ? 'text-text-secondary line-through' : 'text-text-main dark:text-slate-100'
          ]"
        >
          {{ task.title }}
        </p>
        
        <div class="flex items-center gap-3 mt-1">
          <span 
            v-if="category"
            class="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight"
            :class="categoryBadgeClass"
          >
            {{ category.name }}
          </span>
          
          <!-- Match sample secondary meta chip (schedule) in Today view -->
          <span v-if="store.filter.tab === 'today'" class="flex items-center gap-1 text-[10px] text-text-secondary dark:text-slate-500 font-medium">
            <span class="material-symbols-outlined text-[12px]">schedule</span>
            {{ updatedTime }}
          </span>

          <!-- Otherwise show due date when not today -->
          <span v-else-if="!isToday(task.dueDate)" class="flex items-center gap-1 text-[10px] text-text-secondary dark:text-slate-500 font-medium">
            <span class="material-symbols-outlined text-[12px]">calendar_today</span>
            {{ formatDate(task.dueDate) }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="task-actions opacity-0 flex items-center gap-1 transition-opacity">
      <button 
        v-if="!isEditing"
        @click="startEdit"
        class="p-2 text-text-secondary dark:text-slate-400 hover:text-primary hover:bg-background-light dark:hover:bg-slate-800 rounded-lg transition-colors"
        title="Edit"
      >
        <span class="material-symbols-outlined text-[20px]">edit</span>
      </button>
      
      <button 
        class="p-2 text-text-secondary dark:text-slate-400 hover:text-primary hover:bg-background-light dark:hover:bg-slate-800 rounded-lg transition-colors"
        title="Pin"
      >
        <span class="material-symbols-outlined text-[20px]">push_pin</span>
      </button>
      
      <button 
        @click="handleDelete"
        class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
        title="Delete"
      >
        <span class="material-symbols-outlined text-[20px]">delete</span>
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

const checkIconClass = computed(() => {
  // Sample uses: "scale-0 group-active:scale-100 transition-transform"
  // We keep the same behavior, but also reflect persisted done state.
  return [
    'material-symbols-outlined text-primary text-lg',
    'group-active:scale-100 transition-transform',
    props.task.done ? 'scale-100' : 'scale-0',
  ].join(' ')
})

const categoryBadgeClass = computed(() => {
  // Match sample badge look when using known palette colors; otherwise fall back to inline-ish via CSS vars.
  // Note: sample uses Tailwind colors like bg-blue-500/10 text-blue-500.
  const c = category.value?.color?.toLowerCase()
  if (!c) return ''

  const map: Record<string, string> = {
    '#3b82f6': 'bg-blue-500/10 text-blue-500', // blue-500
    '#ee8c2b': 'bg-primary/10 text-primary',
    '#14b8a6': 'bg-teal-500/10 text-teal-500', // teal-500
    '#10b981': 'bg-emerald-500/10 text-emerald-500', // emerald-500
    '#f43f5e': 'bg-rose-500/10 text-rose-500',
    '#6366f1': 'bg-indigo-500/10 text-indigo-500',
    '#06b6d4': 'bg-cyan-500/10 text-cyan-500',
    '#eab308': 'bg-yellow-500/10 text-yellow-500',
    '#a855f7': 'bg-purple-500/10 text-purple-500',
    '#ec4899': 'bg-pink-500/10 text-pink-500',
  }

  return map[c] || ''
})

const updatedTime = computed(() => {
  const d = new Date(props.task.updatedAt)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
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
