<template>
  <div class="flex h-screen w-full bg-background-light dark:bg-background-dark font-display overflow-hidden">
    <CategorySidebar />
    
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-8 py-10">
        <!-- Page Heading -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div class="flex flex-col gap-1">
            <h2 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
              Today, {{ currentDateFormatted }}
            </h2>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-sm">task_alt</span>
              <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {{ store.todayTaskCount }} {{ store.todayTaskCount === 1 ? 'task' : 'tasks' }} remaining for today
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-card-dark/50 p-1 rounded-lg border border-slate-800">
            <button class="p-2 text-slate-400 hover:text-white transition-colors">
              <span class="material-symbols-outlined">grid_view</span>
            </button>
            <button class="p-2 bg-slate-700 text-white rounded shadow-sm">
              <span class="material-symbols-outlined">list</span>
            </button>
          </div>
        </div>
        
        <TaskComposer />
        
        <FiltersBar />
        
        <!-- Empty State -->
        <div v-if="store.filteredTasks.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <span class="material-symbols-outlined text-slate-400 text-3xl">check_circle</span>
          </div>
          <h3 class="text-slate-900 dark:text-white text-xl font-bold mb-2">{{ emptyStateTitle }}</h3>
          <p class="text-slate-500 dark:text-slate-400">{{ emptyStateMessage }}</p>
        </div>
        
        <!-- Grouped Task List -->
        <div v-else class="space-y-10">
          <!-- Today view: group by category -->
          <template v-if="store.filter.tab === 'today'">
            <section v-for="[categoryId, tasks] in store.tasksGroupedByCategory" :key="categoryId">
              <div class="flex items-center gap-3 mb-4">
                <span 
                  class="w-3 h-3 rounded-full" 
                  :style="{ backgroundColor: getCategoryColor(categoryId) }"
                ></span>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {{ getCategoryName(categoryId) }}
                </h3>
              </div>
              <div class="space-y-3">
                <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
              </div>
            </section>
          </template>
          
          <!-- All view: group by date -->
          <template v-else-if="store.filter.tab === 'all'">
            <section v-for="[date, tasks] in store.tasksGroupedByDate" :key="date">
              <div class="flex items-center gap-3 mb-4">
                <span class="material-symbols-outlined text-slate-400">calendar_today</span>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {{ formatDate(date) }}
                </h3>
              </div>
              <div class="space-y-3">
                <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
              </div>
            </section>
          </template>
          
          <!-- Done view: simple list -->
          <template v-else>
            <div class="space-y-3">
              <TaskItem v-for="task in store.filteredTasks" :key="task.id" :task="task" />
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { formatDate } from '@/utils/date'
import CategorySidebar from '@/components/CategorySidebar.vue'
import TaskComposer from '@/components/TaskComposer.vue'
import FiltersBar from '@/components/FiltersBar.vue'
import TaskItem from '@/components/TaskItem.vue'

const store = useTodoStore()

const currentDateFormatted = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const emptyStateTitle = computed(() => {
  if (store.filter.search) return 'No matching tasks'
  if (store.filter.tab === 'today') return 'No tasks for today'
  if (store.filter.tab === 'done') return 'No completed tasks'
  return 'No tasks yet'
})

const emptyStateMessage = computed(() => {
  if (store.filter.search) return 'Try a different search term'
  if (store.filter.tab === 'today') return 'Add your first task to get started'
  if (store.filter.tab === 'done') return 'Complete some tasks to see them here'
  return 'Create a task to get started'
})

function getCategoryName(categoryId: string): string {
  if (categoryId === 'uncategorized') return 'Uncategorized'
  const category = store.categoryById.get(categoryId)
  return category?.name || 'Unknown'
}

function getCategoryColor(categoryId: string): string {
  if (categoryId === 'uncategorized') return '#94a3b8'
  const category = store.categoryById.get(categoryId)
  return category?.color || '#999'
}
</script>
