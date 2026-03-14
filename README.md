# TaskBoard

TaskBoard is a Kanban-style task management app built with React, TypeScript, and Vite.
It supports multiple columns, drag-and-drop for both tasks and columns, inline editing, filtering, search, and bulk actions.

## Live Demo

The app is hosted on Vercel:
https://task-board-beryl-six.vercel.app/

## Tech Stack

- React 19
- TypeScript
- Vite
- Atlassian Pragmatic Drag and Drop
- CSS Modules
- ESLint + Prettier

## Main Features

- Create, rename, and delete columns
- Add, edit, complete, and delete tasks
- Drag and drop tasks between columns
- Reorder columns with drag and drop
- Search and filter tasks
- Select tasks and apply bulk actions
- Persist board state in local storage

- `components`: UI building blocks grouped by feature.
- `hooks`: reusable logic for DnD, filtering, editing, persistence, and state helpers.
- `store`: reducer, context provider, initial state, and persistence helpers.
- `types`: core domain and action types.
- `utils`: utility helpers (for example, search helpers).

## State Management

The app uses React Context + `useReducer`.

- State shape includes todos, columns, column order, filters, search query, and selected task ids.
- State is persisted to local storage and restored on app load.
- All mutations happen through strongly typed reducer actions.

## How To Run Locally

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Runs TypeScript project build and creates a production bundle.

```bash
npm run preview
```

Serves the built app locally for production preview.

```bash
npm run lint
```

Runs ESLint checks.

```bash
npm run format
```

Formats files using Prettier.

```bash
npm run format:check
```

Checks formatting without modifying files.

## Accessibility Notes

- Interactive controls use semantic buttons and ARIA labels where needed.
- Form fields include accessible names.
- Keyboard interactions are supported for critical controls like checkboxes and text input actions.
