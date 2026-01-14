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
  // For Tailwind v4, we only need the 'dark' class
  // When it's not dark, we remove the class (defaults to light)
  if (isDark) {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
}

// Apply initial theme immediately - default to light mode
const initialDarkMode = store.settings.darkMode ?? false
applyTheme(initialDarkMode)

// Subscribe to store changes - this will fire when settings.darkMode changes
store.$subscribe((mutation, state) => {
  applyTheme(state.settings.darkMode)
}, { 
  detached: true
})

app.mount('#app')
