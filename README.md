# Dynamic Form Application

A full-stack dynamic form system with React frontend and Node.js backend.

## Live Demo

- Frontend: https://dynamic-form-demo-2024.netlify.app
- Backend API: https://dynamic-form-app-xgl9.onrender.com

## Milestone Completion Status

### Milestone 1 - Frontend Development ✅
- [x] Dynamic Form Page
  - [x] Form schema fetching with TanStack Query
  - [x] Loading and error states
  - [x] Dynamic form rendering with TanStack Form
  - [x] All 8 field types (text, number, select, multi-select, date, textarea, switch)
  - [x] Labels, placeholders, and required indicators
  - [x] Inline validation error messages
  - [x] All validation rules (minLength, maxLength, regex, min, max, minDate, minSelected, maxSelected)
  - [x] Submit button disabled during submission
  - [x] Loading indicator on submit
  - [x] Success/error messages
  - [x] Form clear after successful submission
  - [x] Navigation to submissions page

- [x] Submissions Table Page
  - [x] TanStack Query for data fetching
  - [x] TanStack Table for table rendering
  - [x] Submission ID, Created Date, View columns
  - [x] Server-side pagination
  - [x] Server-side sorting on createdAt
  - [x] Page info (current page, total pages)
  - [x] Items per page selector (10/20/50)
  - [x] Previous/Next buttons
  - [x] Total submissions count
  - [x] Loading, error, and empty states
  - [x] URL sync for pagination
  - [x] CSV export (bonus)
  - [x] Delete submission (bonus)

### Milestone 2 - Backend Development ✅
- [x] GET /api/form-schema - Returns Employee Onboarding form schema
- [x] POST /api/submissions - Validates and stores submissions
- [x] GET /api/submissions - Paginated, sortable list
- [x] GET /api/submissions/:id - Single submission
- [x] PUT /api/submissions/:id - Update submission (bonus)
- [x] DELETE /api/submissions/:id - Delete submission (bonus)
- [x] Proper validation against schema
- [x] Correct HTTP status codes
- [x] CORS support
- [x] JSON file persistence

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS (ShadCN-style components)
- TanStack Query
- TanStack Form
- TanStack Table
- Radix UI
- React Router DOM
- Lucide React

### Backend
- Node.js
- Express
- JSON file storage
- UUID for unique IDs

## Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server
│   │   ├── formSchema.js     # Form schema definition
│   │   ├── validation.js     # Validation logic
│   │   └── storage.js        # Data persistence
│   ├── data/                  # JSON storage
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/ui/    # UI components
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript types
│   │   ├── lib/              # Utilities
│   │   └── App.tsx           # Main app
│   ├── package.json
│   └── README.md
└── README.md
```

## Setup and Run Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:3001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/form-schema | Get form schema |
| POST | /api/submissions | Create submission |
| GET | /api/submissions | List submissions (paginated) |
| GET | /api/submissions/:id | Get single submission |
| PUT | /api/submissions/:id | Update submission |
| DELETE | /api/submissions/:id | Delete submission |

### Query Parameters for GET /api/submissions

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)
- `search` - Search term

## Known Issues

- None at this time

## Assumptions

- The form schema is static and defined in the backend
- Submissions are stored in a JSON file (lightweight persistence)
- Date validation uses "today" as minimum date reference
- Multi-select validation counts selected items
