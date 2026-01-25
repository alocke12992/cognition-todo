# Coginition Todo

A fullstack todo application built with React, TypeScript, Express, and tsoa.

## Tech Stack

### Frontend
- React
- TypeScript
- HeroUI
- Tailwind CSS
- Vite

### Backend
- Express
- TypeScript
- tsoa
- SQLite database (better-sqlite3)

## Getting Started

### Backend
```bash
cd backend
npm install
npm run migrate  # Import existing todos from JSON (first time only)
npm run dev
```

The backend will run on http://localhost:3000

#### Database Configuration

The application uses SQLite for data storage. By default, the database file is created at `backend/src/data/todos.db`. You can customize the location by setting the `DATABASE_PATH` environment variable:

```bash
DATABASE_PATH=/path/to/custom/todos.db npm run dev
```

#### Migration from JSON

If you have existing todos in `todos.json`, run the migration script to import them into the SQLite database:

```bash
npm run migrate
```

The migration script will:
- Create the SQLite database if it doesn't exist
- Import all todos from `todos.json`
- Skip migration if the database already contains data (to prevent duplicates)
- Keep the original `todos.json` file as a backup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

## Features

- View all todos
- Mark todos as completed
- RESTful API with tsoa

## Creating GitHub Issues

This repository includes sample issues that can be automatically created in your GitHub repository.

### Setup

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Create a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" (classic)
   - Give it a name like "Cognition Todo Issues"
   - Select the `repo` scope (Full control of private repositories)
   - Copy the generated token

3. Add your token to the `.env` file:
```
GITHUB_ACCESS_TOKEN=your_token_here
GITHUB_OWNER=alocke12992
GITHUB_REPO=cognition-todo
```

### Run the Script

```bash
npm install
npm run create-issues
```

This will create 10 issues in your GitHub repository ranging from simple fixes to complex architectural changes. Each issue includes:
- Descriptive title
- Appropriate labels
- Detailed description
- Implementation details
- Acceptance criteria

The issues are defined in `sampleIssues.json` and can be customized before running the script.
