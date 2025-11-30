# Dynamic Form Frontend

React application for the dynamic form system with TanStack Query, Form, and Table.

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- TanStack Query (server state management)
- TanStack Form (form state management)
- TanStack Table (data table)
- Radix UI (accessible components)
- Lucide React (icons)
- React Router DOM (routing)

## Features

### Dynamic Form Page
- Fetches form schema from backend API
- Renders all 8 field types dynamically
- Client-side validation with inline error messages
- Loading and error states
- Success/error feedback on submission
- Auto-navigation to submissions page after success

### Submissions Table Page
- Server-side pagination
- Server-side sorting by createdAt
- View submission details in modal
- Delete submissions
- CSV export
- Items per page selector (10/20/50)
- URL sync for pagination state

## Setup

```bash
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Environment Variables

Create a `.env` file if needed:

```
VITE_API_URL=http://localhost:3001
```
