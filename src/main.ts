import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles.css'
import { useTodoStore } from './stores/todo'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Apply initial theme
const store = useTodoStore()
const htmlElement = document.documentElement

function applyTheme(isDark: boolean) {
  if (isDark) {
    htmlElement.classList.add('dark')
    htmlElement.classList.remove('light')
  } else {
    htmlElement.classList.remove('dark')
    htmlElement.classList.add('light')
  }
}

// Apply initial theme
applyTheme(store.settings.darkMode)

// Watch for theme changes - subscribe to store mutations
// This will fire whenever the store state changes
store.$subscribe((mutation, state) => {
  // Apply theme whenever settings change
  applyTheme(state.settings.darkMode)
}, { 
  detached: true 
})

app.mount('#app')
