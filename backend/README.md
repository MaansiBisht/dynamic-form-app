# Dynamic Form Backend

REST API backend for the dynamic form system.

## Tech Stack

- Node.js with Express
- JSON file-based storage
- UUID for unique IDs

## API Endpoints

### GET /api/form-schema
Returns the Employee Onboarding form schema.

### POST /api/submissions
Creates a new form submission with validation.

### GET /api/submissions
Returns paginated, sortable list of submissions.

Query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)
- `search` - Search term

### GET /api/submissions/:id
Returns a single submission by ID.

### PUT /api/submissions/:id
Updates a submission.

### DELETE /api/submissions/:id
Deletes a submission.

## Setup

```bash
npm install
npm run dev
```

Server runs on http://localhost:3001
