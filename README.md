# Netlyze Todo

A fast, beautiful, and fully functional todo app for managing your daily tasks. Built with Vue 3, TypeScript, and Vite. All data is stored locally in your browser.

## Features

### Core Functionality
- ✅ Quick task creation with keyboard shortcuts
- ✅ Mark tasks as complete/incomplete
- ✅ Edit tasks inline (double-click to edit)
- ✅ Delete tasks with confirmation
- ✅ Due dates with smart defaults

### Organization
- 📁 **Categories**: Create, edit, and delete categories with custom colors
- 🏷️ **Filters**: View by Today, All, or Done
- 🔍 **Search**: Quick search across all tasks
- 📊 **Smart Grouping**: 
  - Today view: Grouped by category
  - All view: Grouped by date
  - Done view: Simple list

### User Experience
- 🌓 **Dark Mode**: Toggle between light and dark themes
- ⌨️ **Keyboard Shortcuts**:
  - `Enter` to add a task
  - `Esc` to cancel editing
  - `Cmd/Ctrl+K` to focus search
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 💾 **Auto-save**: All changes saved automatically to localStorage
- 📥 **Export/Import**: Backup and restore your data as JSON

### Data Model
- **Tasks**: Title, due date, category, completion status
- **Categories**: Name and color for organization
- **Settings**: Remembers your last used category and theme preference

## Tech Stack

- **Vue 3** (Composition API) + **TypeScript**
- **Vite** for blazing fast development
- **Pinia** for state management
- **LocalStorage** for persistence
- **Plain CSS** with CSS custom properties for theming

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

3. **Build for production:**
```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy as a static site.

4. **Preview production build:**
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── CategorySidebar.vue   # Sidebar with categories and navigation
│   ├── FiltersBar.vue         # Filter tabs and search
│   ├── TaskComposer.vue       # Input form for creating tasks
│   └── TaskItem.vue           # Individual task display
├── stores/
│   └── todo.ts                # Pinia store with all state and actions
├── utils/
│   ├── date.ts                # Date formatting utilities
│   ├── id.ts                  # ID generation
│   └── storage.ts             # LocalStorage helpers
├── App.vue                    # Main app component
├── main.ts                    # App entry point
├── styles.css                 # Global styles and theme
└── types.ts                   # TypeScript type definitions
```

## Data Storage

All data is stored in localStorage under these keys:
- `netlyze.todo.tasks.v1` - All tasks
- `netlyze.todo.categories.v1` - All categories
- `netlyze.todo.settings.v1` - User preferences

The app validates data on load and handles corrupted data gracefully by resetting to defaults.

## Deployment

This is a static site and can be deployed to:
- **Netlify**: Connect your repo and deploy automatically
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Serve from the `dist` folder
- **Any static hosting**: Just upload the `dist` folder

### Example: Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify or connect your Git repository
```

## Browser Support

Works in all modern browsers that support:
- ES2020+
- localStorage
- CSS Custom Properties
- Web Crypto API

## License

MIT

## Contributing

This is a personal project, but feel free to fork and customize it for your needs!

---

Built with ❤️ for productive people
