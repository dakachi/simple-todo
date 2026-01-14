<template>
  <div class="app" :class="{ 'dark-mode': store.settings.darkMode }">
    <CategorySidebar />
    
    <main class="main-content">
      <div class="container">
        <TaskComposer ref="composerRef" />
        
        <FiltersBar />
        
        <div v-if="store.filteredTasks.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <h2>{{ emptyStateTitle }}</h2>
          <p>{{ emptyStateMessage }}</p>
        </div>
        
        <div v-else class="task-list">
          <!-- Today view: group by category -->
          <template v-if="store.filter.tab === 'today'">
            <div 
              v-for="[categoryId, tasks] in store.tasksGroupedByCategory" 
              :key="categoryId"
              class="task-group"
            >
              <div class="group-header">
                <span class="group-title">
                  <span 
                    v-if="categoryId !== 'uncategorized'"
                    class="category-dot" 
                    :style="{ backgroundColor: getCategoryColor(categoryId) }"
                  ></span>
                  {{ getCategoryName(categoryId) }}
                </span>
                <span class="group-count">{{ tasks.length }}</span>
              </div>
              
              <div class="group-tasks">
                <TaskItem 
                  v-for="task in tasks" 
                  :key="task.id" 
                  :task="task"
                />
              </div>
            </div>
          </template>
          
          <!-- All view: group by date -->
          <template v-else-if="store.filter.tab === 'all'">
            <div 
              v-for="[date, tasks] in store.tasksGroupedByDate" 
              :key="date"
              class="task-group"
            >
              <div class="group-header">
                <span class="group-title">{{ formatDate(date) }}</span>
                <span class="group-count">{{ tasks.length }}</span>
              </div>
              
              <div class="group-tasks">
                <TaskItem 
                  v-for="task in tasks" 
                  :key="task.id" 
                  :task="task"
                />
              </div>
            </div>
          </template>
          
          <!-- Done view: simple list -->
          <template v-else>
            <div class="group-tasks">
              <TaskItem 
                v-for="task in store.filteredTasks" 
                :key="task.id" 
                :task="task"
              />
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { formatDate } from '@/utils/date'
import CategorySidebar from '@/components/CategorySidebar.vue'
import TaskComposer from '@/components/TaskComposer.vue'
import FiltersBar from '@/components/FiltersBar.vue'
import TaskItem from '@/components/TaskItem.vue'

const store = useTodoStore()
const composerRef = ref<InstanceType<typeof TaskComposer>>()

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
  if (categoryId === 'uncategorized') return '#ccc'
  const category = store.categoryById.get(categoryId)
  return category?.color || '#999'
}
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
}

.empty-state svg {
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--text);
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.task-group {
  animation: fadeIn 0.3s;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.group-count {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--hover-bg);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.group-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>
