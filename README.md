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
- SQLite database for data storage (with better-sqlite3)

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:3000

On first run, the server will automatically:
1. Create the SQLite database at `backend/src/data/todos.db`
2. Migrate any existing todos from `todos.json` to the database

You can also run the migration manually:
```bash
npm run migrate
```

To use a custom database location, set the `DATABASE_PATH` environment variable:
```bash
DATABASE_PATH=/path/to/custom.db npm run dev
```

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
