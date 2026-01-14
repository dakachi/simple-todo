<template>
  <div class="task-row flex items-center justify-between p-4 bg-white dark:bg-card-dark/40 border border-slate-200 dark:border-slate-800/50 rounded-xl hover:border-primary/30 hover:bg-white dark:hover:bg-card-dark transition-all group cursor-default">
    <div class="flex items-center gap-4">
      <div class="relative flex items-center justify-center w-6 h-6 rounded-md border-2 border-slate-300 dark:border-slate-700 group-hover:border-primary transition-colors cursor-pointer">
        <input 
          type="checkbox" 
          :checked="task.done"
          @change="store.toggleTask(task.id)"
          class="opacity-0 absolute inset-0 cursor-pointer z-10"
        />
        <span 
          :class="[
            'material-symbols-outlined text-primary text-lg transition-transform',
            task.done ? 'scale-100' : 'scale-0'
          ]"
        >
          check
        </span>
      </div>
      
      <div class="flex flex-col">
        <input
          v-if="isEditing"
          ref="editInputRef"
          v-model="editTitle"
          type="text"
          class="bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100 font-medium text-base"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
          @blur="saveEdit"
        />
        <p 
          v-else
          @dblclick="startEdit"
          :class="[
            'font-medium',
            task.done ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'
          ]"
        >
          {{ task.title }}
        </p>
        
        <div class="flex items-center gap-3 mt-1">
          <span 
            v-if="category"
            class="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight"
            :style="{ 
              backgroundColor: `${category.color}10`, 
              color: category.color 
            }"
          >
            {{ category.name }}
          </span>
          
          <span v-if="!isToday(task.dueDate)" class="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
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
        class="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        title="Edit"
      >
        <span class="material-symbols-outlined text-[20px]">edit</span>
      </button>
      
      <button 
        class="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
