<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased h-screen overflow-hidden">
    <div class="flex h-full w-full">
      <CategorySidebar />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div class="max-w-4xl mx-auto px-8 py-10">
          <!-- PageHeading -->
          <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div class="flex flex-col gap-1">
              <h2 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
                Today, {{ currentDateFormatted }}
              </h2>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-sm">task_alt</span>
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {{ store.todayTaskCount }} tasks remaining for today
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

          <!-- Composer -->
          <TaskComposer />

          <!-- Filters & Search Bar -->
          <FiltersBar />

          <!-- Empty State (kept, but styled to stay subtle) -->
          <div v-if="store.filteredTasks.length === 0" class="text-center py-16">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">{{ emptyStateTitle }}</p>
            <p class="text-slate-500/80 dark:text-slate-400/80 text-sm mt-2">{{ emptyStateMessage }}</p>
          </div>

          <!-- Grouped Task List -->
          <div v-else class="space-y-10">
            <!-- Today view: group by category -->
            <template v-if="store.filter.tab === 'today'">
              <section v-for="[categoryId, tasks] in store.tasksGroupedByCategory" :key="categoryId">
                <div class="flex items-center gap-3 mb-4">
                  <span
                    class="w-3 h-3 rounded-full"
                    :class="categoryDotClass(categoryId)"
                    :style="categoryDotStyle(categoryId)"
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

            <!-- All view: group by due date sections -->
            <template v-else-if="store.filter.tab === 'all'">
              <section v-for="[date, tasks] in store.tasksGroupedByDate" :key="date">
                <div class="flex items-center gap-3 mb-4">
                  <span class="w-3 h-3 rounded-full bg-slate-500"></span>
                  <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {{ formatDate(date) }}
                  </h3>
                </div>
                <div class="space-y-3">
                  <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
                </div>
              </section>
            </template>

            <!-- Done view -->
            <template v-else>
              <div class="space-y-3">
                <TaskItem v-for="task in store.filteredTasks" :key="task.id" :task="task" />
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>
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

function categoryDotClass(categoryId: string): string {
  if (categoryId === 'uncategorized') return 'bg-slate-500'
  const hex = store.categoryById.get(categoryId)?.color?.toLowerCase()
  if (!hex) return ''
  const map: Record<string, string> = {
    '#3b82f6': 'bg-blue-500',
    '#ee8c2b': 'bg-primary',
    '#14b8a6': 'bg-teal-500',
    '#10b981': 'bg-emerald-500',
    '#f43f5e': 'bg-rose-500',
    '#6366f1': 'bg-indigo-500',
    '#06b6d4': 'bg-cyan-500',
    '#eab308': 'bg-yellow-500',
    '#a855f7': 'bg-purple-500',
    '#ec4899': 'bg-pink-500',
  }
  return map[hex] || ''
}

function categoryDotStyle(categoryId: string): Record<string, string> {
  if (categoryId === 'uncategorized') return {}
  const hex = store.categoryById.get(categoryId)?.color
  if (!hex) return {}
  return categoryDotClass(categoryId) ? {} : { backgroundColor: hex }
}
</script>
