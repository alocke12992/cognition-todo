# Sample GitHub Issues for Cognition Todo

This document contains sample issues ranging from simple fixes to complex architectural changes that can be added to the GitHub repository.

---

## Issue #1: Remove Unused Import in Dashboard Component

**Labels:** `good first issue`, `bug`, `frontend`

**Description:**
The `Dashboard.tsx` component imports `CardHeader` from `@heroui/react` but never uses it in the component.

**Current Code:**
```tsx
import { Card, CardBody, CardHeader, Checkbox, Spinner } from '@heroui/react';
```

**Expected Behavior:**
Remove the unused `CardHeader` import to clean up the code and avoid confusion.

**Files Affected:**
- `frontend/src/components/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] Remove `CardHeader` from the import statement
- [ ] Verify the application still builds and runs correctly

---

## Issue #2: Add Create Todo Functionality to UI

**Labels:** `enhancement`, `frontend`, `feature`

**Description:**
The backend has a POST endpoint for creating new todos (`/api/todos`), but the frontend dashboard doesn't provide any UI to create new todos. Users can only view and toggle completion status of existing todos.

**Proposed Solution:**
Add a form or modal to the Dashboard component that allows users to create new todos with a title and description.

**Implementation Details:**
- Add a "New Todo" button to the dashboard header
- Create a modal or form component with inputs for:
  - Title (required)
  - Description (required)
- On submit, POST to `/api/todos` and refresh the todo list
- Handle loading and error states appropriately

**Files Affected:**
- `frontend/src/components/Dashboard.tsx` (or create new component)

**Acceptance Criteria:**
- [ ] User can click a button to open a create todo form
- [ ] Form validates that title and description are not empty
- [ ] Successfully created todo appears in the list immediately
- [ ] Form resets after successful creation
- [ ] Error messages are displayed if creation fails

---

## Issue #3: Improve Error Handling for Toggle Todo Action

**Labels:** `bug`, `enhancement`, `frontend`

**Description:**
When toggling a todo's completion status fails, the error is only logged to the console (`console.error`). Users receive no visual feedback that the action failed, leading to confusion.

**Current Behavior:**
```tsx
catch (err) {
  console.error('Error updating todo:', err);
}
```

**Expected Behavior:**
Display a user-friendly error message (toast notification, alert, or error banner) when the toggle action fails.

**Proposed Solution:**
- Use HeroUI's toast/notification component or create a simple error display
- Show a message like "Failed to update todo. Please try again."
- Consider adding a retry mechanism

**Files Affected:**
- `frontend/src/components/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] User sees a visible error message when toggle fails
- [ ] Error message is user-friendly and actionable
- [ ] Error message auto-dismisses after a few seconds
- [ ] Console error logging is retained for debugging

---

## Issue #4: Add Delete Todo Functionality to UI

**Labels:** `enhancement`, `frontend`, `feature`

**Description:**
The backend has a DELETE endpoint (`/api/todos/:id`), but the frontend doesn't provide any way for users to delete todos from the UI.

**Proposed Solution:**
Add a delete button to each todo card that allows users to remove todos from the list.

**Implementation Details:**
- Add a delete icon/button to each todo card (consider placement and styling)
- Add confirmation dialog before deleting (to prevent accidental deletions)
- Call DELETE `/api/todos/:id` endpoint
- Remove the todo from the local state on success
- Handle errors gracefully with user feedback

**Files Affected:**
- `frontend/src/components/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] Each todo has a visible delete button/icon
- [ ] Clicking delete shows a confirmation dialog
- [ ] Confirming deletion removes the todo from the list
- [ ] Canceling deletion keeps the todo in the list
- [ ] Error message is shown if deletion fails
- [ ] Deleted todo is immediately removed from the UI

---

## Issue #5: Add Filtering and Sorting Options for Todos

**Labels:** `enhancement`, `frontend`, `feature`

**Description:**
The dashboard currently displays all todos in the order they're received from the backend. As the list grows, users need ways to filter and sort todos to find what they're looking for.

**Proposed Features:**
1. **Filters:**
   - All todos (default)
   - Active (uncompleted) todos only
   - Completed todos only

2. **Sorting:**
   - Date created (newest first / oldest first)
   - Alphabetically by title (A-Z / Z-A)
   - Completion status (completed first / active first)

**Implementation Details:**
- Add filter buttons/tabs above the todo list
- Add a sort dropdown menu
- Implement filtering and sorting logic in the component
- Persist filter/sort preferences in localStorage (optional enhancement)

**Files Affected:**
- `frontend/src/components/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] User can filter todos by completion status
- [ ] User can sort todos by multiple criteria
- [ ] Active filter/sort options are visually indicated
- [ ] Filtering and sorting work together correctly
- [ ] Performance is maintained with large todo lists

---

## Issue #6: Implement Search Functionality

**Labels:** `enhancement`, `frontend`, `feature`

**Description:**
Users need the ability to search through their todos by title or description to quickly find specific tasks.

**Proposed Solution:**
Add a search input field that filters the todo list in real-time as the user types.

**Implementation Details:**
- Add a search input in the dashboard header
- Filter todos client-side based on search query
- Search should match against both title and description
- Search should be case-insensitive
- Show "No results found" message when search returns empty
- Add a clear button to reset search

**Files Affected:**
- `frontend/src/components/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] Search input is prominently displayed
- [ ] Typing in search immediately filters the todo list
- [ ] Search matches title and description fields
- [ ] Search is case-insensitive
- [ ] Clear button removes search filter
- [ ] Search works in combination with other filters

---

## Issue #7: Add Priority Levels to Todos

**Labels:** `enhancement`, `feature`, `frontend`, `backend`

**Description:**
Todos currently have no way to indicate priority or urgency. Adding priority levels would help users organize and focus on important tasks.

**Proposed Solution:**
Add a `priority` field to todos with three levels: High, Medium, Low.

**Implementation Details:**

**Backend Changes:**
- Update `Todo` interface to include `priority: 'high' | 'medium' | 'low'`
- Update `CreateTodoRequest` to accept optional priority (default to 'medium')
- Update `UpdateTodoRequest` to allow updating priority
- Update existing todos in `todos.json` with default priority

**Frontend Changes:**
- Add priority selection to create/edit todo forms
- Display priority visually (colored badges, icons, or borders)
- Add ability to filter by priority
- Add ability to sort by priority
- Consider color coding: red (high), yellow (medium), green (low)

**Files Affected:**
- `backend/src/models/Todo.ts`
- `backend/src/services/todoService.ts`
- `backend/src/data/todos.json`
- `frontend/src/types/Todo.ts`
- `frontend/src/components/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] Todos have a priority field (high, medium, low)
- [ ] Users can set priority when creating todos
- [ ] Users can update priority of existing todos
- [ ] Priority is visually indicated in the UI
- [ ] Users can filter todos by priority
- [ ] Users can sort todos by priority
- [ ] All existing todos get migrated with default priority

---

## Issue #8: Implement Optimistic UI Updates

**Labels:** `enhancement`, `frontend`, `ux`, `intermediate`

**Description:**
Currently, when a user toggles a todo's completion status, there's a delay before the UI updates (waiting for the server response). This creates a sluggish user experience, especially on slower connections.

**Proposed Solution:**
Implement optimistic UI updates where the UI updates immediately when the user clicks, then rollback if the server request fails.

**Implementation Details:**
- Update local state immediately when user toggles checkbox
- Make the API request in the background
- If the request fails, revert the local state and show an error
- Consider adding a visual indicator for pending requests
- Apply the same pattern to create and delete operations

**Technical Approach:**
```tsx
const toggleTodoComplete = async (id: string, completed: boolean) => {
  // Optimistically update UI
  setTodos(todos.map(todo =>
    todo.id === id ? { ...todo, completed: !completed } : todo
  ));

  try {
    await fetch(`/api/todos/${id}`, { /* ... */ });
  } catch (err) {
    // Rollback on error
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed } : todo
    ));
    showError('Failed to update todo');
  }
};
```

**Files Affected:**
- `frontend/src/components/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] UI updates immediately when user interacts
- [ ] Changes are rolled back if API request fails
- [ ] User is notified of failures
- [ ] No race conditions when making multiple rapid changes
- [ ] Works for toggle, create, and delete operations

---

## Issue #9: Replace JSON File Storage with SQLite Database

**Labels:** `enhancement`, `backend`, `architecture`, `breaking-change`

**Description:**
The current implementation uses a JSON file for data persistence. While suitable for development and simple use cases, it has several limitations:
- No concurrent access handling (race conditions possible)
- Entire file must be read/written for each operation
- No data validation or constraints
- No transaction support
- Limited query capabilities

**Proposed Solution:**
Migrate from JSON file storage to SQLite database for better performance, reliability, and scalability.

**Implementation Details:**

**Backend Changes:**
1. Add SQLite dependencies (`better-sqlite3` or `sqlite3`)
2. Create database schema and migration scripts
3. Update `TodoService` to use database queries instead of file operations
4. Add connection pooling and proper error handling
5. Maintain backward compatibility during migration

**Database Schema:**
```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
```

**Migration Strategy:**
- Read existing `todos.json` and import into database
- Keep JSON file as backup until migration is verified
- Update README with new setup instructions

**Files Affected:**
- `backend/package.json` (add database dependencies)
- `backend/src/services/todoService.ts` (major refactor)
- `backend/src/db/` (new directory for database setup)
- `backend/src/migrations/` (new directory for migrations)
- `README.md` (update documentation)

**Acceptance Criteria:**
- [ ] SQLite database is properly initialized on first run
- [ ] All CRUD operations work with database
- [ ] Existing todos are migrated from JSON file
- [ ] Database queries are optimized with indexes
- [ ] Proper error handling for database operations
- [ ] Unit tests updated to use test database
- [ ] Documentation updated with new setup steps
- [ ] Performance is improved or maintained

**Breaking Changes:**
- Database file location must be configured
- Deployment process may need updates

---

## Issue #10: Add User Authentication and Multi-tenancy

**Labels:** `enhancement`, `feature`, `backend`, `frontend`, `architecture`, `complex`

**Description:**
Currently, all users share the same todo list. The application should support multiple users, each with their own private todo lists.

**Proposed Solution:**
Implement user authentication and authorization system to support multiple users.

**Implementation Details:**

**Backend Changes:**
1. Add authentication library (Passport.js, JWT, or similar)
2. Create User model/table with fields:
   - id, email, password (hashed), name, created_at
3. Add authentication endpoints:
   - POST `/api/auth/register` - Create new account
   - POST `/api/auth/login` - Login and get token
   - POST `/api/auth/logout` - Logout
   - GET `/api/auth/me` - Get current user
4. Update Todos table to include `user_id` foreign key
5. Add authentication middleware to protect todo routes
6. Filter todos by logged-in user in all queries
7. Add proper authorization checks (users can only access their own todos)

**Frontend Changes:**
1. Create login/register pages or modals
2. Store authentication token (localStorage or httpOnly cookie)
3. Add authentication context/state management
4. Redirect unauthenticated users to login page
5. Add logout functionality
6. Include auth token in all API requests
7. Handle token expiration and refresh

**Security Considerations:**
- Hash passwords with bcrypt or argon2
- Use secure JWT tokens with expiration
- Implement CSRF protection
- Add rate limiting to prevent brute force
- Validate and sanitize all user inputs
- Use HTTPS in production

**Database Schema Changes:**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

ALTER TABLE todos ADD COLUMN user_id TEXT NOT NULL REFERENCES users(id);
```

**Files Affected:**
- `backend/src/models/User.ts` (new)
- `backend/src/controllers/authController.ts` (new)
- `backend/src/middleware/auth.ts` (new)
- `backend/src/services/authService.ts` (new)
- `backend/src/services/todoService.ts` (update to filter by user)
- `backend/src/models/Todo.ts` (add userId field)
- `frontend/src/contexts/AuthContext.tsx` (new)
- `frontend/src/components/Login.tsx` (new)
- `frontend/src/components/Register.tsx` (new)
- `frontend/src/components/Dashboard.tsx` (add auth checks)
- `frontend/src/App.tsx` (add routing and auth provider)

**Acceptance Criteria:**
- [ ] Users can register with email and password
- [ ] Users can login and receive authentication token
- [ ] Users can logout
- [ ] Passwords are securely hashed
- [ ] Each user only sees their own todos
- [ ] Protected routes require authentication
- [ ] Token expiration is handled gracefully
- [ ] Login session persists across page refreshes
- [ ] Comprehensive error handling for auth failures
- [ ] Input validation prevents common security issues
- [ ] Rate limiting prevents brute force attacks
- [ ] Documentation updated with auth setup instructions
- [ ] Tests cover authentication and authorization flows

**Breaking Changes:**
- All existing todos would need to be assigned to a default user or deleted
- API requires authentication tokens for all todo operations
- Frontend routing structure changes significantly

**Future Enhancements:**
- Social login (Google, GitHub, etc.)
- Password reset functionality
- Email verification
- Two-factor authentication
- Role-based access control
