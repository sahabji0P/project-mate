# Task Mate - Frontend

Modern, responsive task management application built with React, TypeScript, and shadcn/ui.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Application will be available at: `http://localhost:5173`

## 📋 Prerequisites

- Node.js 16+
- Running backend API (see backend README)

## ⚙️ Environment Variables

Create a `.env` file in the frontend root: This is used to connect the backend with your frontend.

```env
VITE_API_URL=http://localhost:5000
```

**Important**: All Vite environment variables must be prefixed with `VITE_`

## ✨ Features

- **Authentication**: Secure login/register with JWT
- **Project Management**: Create and organize multiple projects
- **Task Management**: 
  - Kanban board view with drag-and-drop
  - List view with sections (Today, Tomorrow, Later)
  - Color-coded priority (High, Medium, Low)
  - Task status tracking (Todo, In Progress, Done)
- **AI Assistant**: 
  - Context-aware chat powered by Google Gemini
  - Project summaries and insights
  - Task suggestions and productivity tips
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Theme**: Beautiful dark mode interface

## 🏗️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Routing & State
- **React Router v6** - Client-side routing
- **React Context API** - Global state management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

### Forms & Data
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client

### Drag & Drop
- **@dnd-kit** - Drag and drop functionality

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.jpeg    # App branding
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── auth/           # Login, Register, ProtectedRoute
│   │   ├── layout/         # Headers, Navigation
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AIChat.tsx      # AI assistant chat
│   │   ├── ProjectCard.tsx
│   │   ├── TaskCard.tsx
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx    # Authentication state
│   │   ├── ProjectContext.tsx # Project management
│   │   └── TaskContext.tsx    # Task management
│   ├── pages/
│   │   ├── Index.tsx       # Dashboard
│   │   ├── TaskBoard.tsx   # Kanban/List view
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── services/
│   │   ├── api.ts          # Axios instance
│   │   ├── auth.ts         # Auth API calls
│   │   ├── project.ts      # Project API calls
│   │   └── ai.ts           # AI API calls
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   └── utils.ts        # Helper functions
│   └── main.tsx           # App entry point
└── index.html
```

## 🎨 UI Components

All UI components are built with **shadcn/ui** and fully customizable:

- Forms: Input, Label, Button, Select, Checkbox, Radio
- Overlays: Dialog, Dropdown Menu, Popover, Tooltip
- Feedback: Alert, Toast, Badge, Progress
- Layout: Card, Separator, Tabs, Accordion
- Data: Table, Avatar, Calendar
- Navigation: Navigation Menu, Breadcrumb

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns access token (15min) + refresh token (7d)
3. Tokens stored in AuthContext
4. Access token sent in `Authorization: Bearer <token>` header
5. Auto-refresh on 401 responses
6. Logout clears tokens

## 🎯 Key Features Breakdown

### Task Board Views

**Kanban View**:
- Drag and drop tasks between columns
- Columns: Todo, In Progress, Done
- Visual priority indicators
- Real-time status updates

**List View**:
- Organized by sections: Today, Tomorrow, Later
- Checkbox completion
- Inline editing
- Filter by priority

### AI Assistant

- **Toggle**: Floating button (bottom-right)
- **Mobile**: Full-screen with backdrop overlay
- **Desktop**: Side panel (384px width)
- **Context-Aware**: Knows your current project
- **Smart**: Analyzes tasks, suggests priorities, provides insights

### Responsive Design

- **Mobile** (< 768px): 
  - Full-width AI chat with backdrop
  - Hamburger menus
  - Stacked layouts
  
- **Tablet** (768px - 1024px):
  - Side-by-side layouts
  - Compact navigation
  
- **Desktop** (> 1024px):
  - Full feature set
  - Multi-column layouts
  - Floating AI assistant

## 🛠️ Development

### Code Style
- TypeScript strict mode enabled
- ESLint configured
- Prettier formatting (auto on save recommended)

### Component Patterns
- Functional components with hooks
- Context providers for global state
- Custom hooks for reusable logic
- TypeScript interfaces for props

### API Integration
All API calls use the axios instance from `src/services/api.ts`:
- Automatic base URL configuration
- Request/response interceptors
- Token injection
- Error handling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Environment Variables for Production

```env
VITE_API_URL=https://your-api-domain.com
```

### Deploy to Vercel/Netlify

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Deploy to Static Host

```bash
npm run build
# Upload dist/ folder to your static host
```

## 📦 Available Scripts

```bash
npm run dev          # Start dev server (hot reload)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🧪 Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "axios": "^1.7.9",
  "@dnd-kit/core": "^6.3.1",
  "@radix-ui/react-dialog": "^1.1.2",
  "tailwindcss": "^3.4.17",
  "zod": "^3.24.1"
}
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      // Customize your color palette
    }
  }
}
```

### Add Components

```bash
npx shadcn@latest add <component-name>
```

## 🐛 Troubleshooting

**API Connection Issues**:
- Verify `VITE_API_URL` in `.env`
- Check backend is running
- Verify CORS settings in backend

**Build Errors**:
- Clear cache: `rm -rf node_modules .vite dist`
- Reinstall: `npm install`
- Rebuild: `npm run build`

**TypeScript Errors**:
- Check `tsconfig.json` settings
- Run `npm run build` to see all errors
