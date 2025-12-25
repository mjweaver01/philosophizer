# Authentication Implementation

## Overview
This document describes the authentication system that has been added to Philosophizer, including user login, signup, and user-specific conversations.

## Features Added

### 1. **User Authentication**
- Email and password-based authentication
- JWT token-based sessions
- Secure password hashing using bcryptjs
- PostgreSQL database for user storage

### 2. **User-Specific Conversations**
- Each conversation is now associated with a user
- Users can only see and manage their own conversations
- All conversation endpoints now require authentication

### 3. **Protected Routes**
- `/agent` - Requires authentication
- `/conversations` - Requires authentication
- `/conversations/:id` - Requires authentication (filtered by user)

## Backend Changes

### Database Schema (`src/db/schema.sql`)
- Updated `users` table to include `password_hash` field
- Existing magic links table structure preserved for future use

### New Files Created

#### 1. `src/db/connection.ts`
PostgreSQL connection pool management with singleton pattern.

**Environment Variables Required:**
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

#### 2. `src/utils/auth.ts`
Core authentication utilities:
- `createUser(email, password)` - Create new user account
- `authenticateUser(email, password)` - Login with credentials
- `getUserFromRequest(request)` - Extract and validate JWT from request
- `generateToken(user)` - Create JWT token
- `verifyToken(token)` - Validate JWT token

**Environment Variables:**
```bash
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

#### 3. `src/middleware/auth.ts`
Authentication middleware for protecting routes:
- `requireAuth(request)` - Requires valid authentication, returns 401 if not authenticated
- `optionalAuth(request)` - Optionally extracts user without requiring authentication

#### 4. `src/endpoints/auth.ts`
Authentication endpoints:
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/me` - Get current authenticated user

### Modified Files

#### 1. `src/utils/conversations.ts`
All conversation functions now require and filter by `userId`:
- `createConversation(userId, title?)` - Create conversation for user
- `getConversation(id, userId?)` - Get conversation (filtered by user)
- `listConversations(userId)` - List all conversations for user
- `searchConversations(userId, query, ...)` - Search user's conversations
- `updateConversation(id, userId, updates)` - Update user's conversation
- `deleteConversation(id, userId)` - Delete user's conversation
- `saveMessages(conversationId, userId, messages)` - Save messages to user's conversation

#### 2. `src/endpoints/conversations.ts`
All endpoints now use `requireAuth` middleware and pass `userId` to functions.

#### 3. `src/endpoints/agent.ts`
Agent endpoint now requires authentication and validates user before processing requests.

#### 4. `src/index.ts`
Added new routes:
- `/auth/signup` - Signup endpoint
- `/auth/login` - Login endpoint
- `/auth/me` - Current user endpoint
- `/login` - Login page (frontend)
- `/signup` - Signup page (frontend)

## Frontend Changes

### New Files Created

#### 1. `src/frontend/contexts/AuthContext.tsx`
React context for managing authentication state:
- Stores user information and JWT token
- Provides `login()`, `signup()`, and `logout()` functions
- Automatically loads token from localStorage on mount
- Validates token with backend

#### 2. `src/frontend/pages/LoginPage.tsx`
Login page with email/password form and validation.

#### 3. `src/frontend/pages/SignupPage.tsx`
Signup page with email/password/confirm password form and validation.

### Modified Files

#### 1. `src/frontend/index.tsx`
- Wrapped app in `AuthProvider`
- Added routing for `/login` and `/signup` pages

#### 2. `src/frontend/pages/ChatPage.tsx`
- Added authentication check - redirects to login if not authenticated
- Updated `useChat` transport to include JWT token in headers
- Shows loading state while checking authentication

#### 3. `src/frontend/hooks/useConversations.ts`
- Added `getAuthHeaders()` helper function
- All API calls now include `Authorization: Bearer <token>` header

#### 4. `src/frontend/components/ConversationSidebar.tsx`
- Added user email display in footer
- Added logout button with icon

## Setup Instructions

### 1. Install Dependencies
```bash
bun install
```

The following packages were added:
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT token management
- `@types/jsonwebtoken` - TypeScript types
- `@types/pg` - TypeScript types
- `bcryptjs` - Password hashing

### 2. Setup Database
Ensure you have PostgreSQL running and create a database:

```bash
createdb philosophizer
```

Run the schema to create tables:
```bash
psql -d philosophizer -f src/db/schema.sql
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/philosophizer

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Existing environment variables...
# (Keep your existing OPENAI_API_KEY, CHROMA_URL, etc.)
```

### 4. Start the Server
```bash
bun run dev
```

## API Usage Examples

### Signup
```bash
curl -X POST http://localhost:1738/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "mypassword"
  }'
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
```bash
curl -X POST http://localhost:1738/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "mypassword"
  }'
```

### Get Current User
```bash
curl http://localhost:1738/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Create Conversation (with auth)
```bash
curl -X POST http://localhost:1738/conversations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"title": "My Conversation"}'
```

## Security Considerations

1. **JWT Secret**: Change the `JWT_SECRET` in production to a strong, random value
2. **HTTPS**: Use HTTPS in production to protect tokens in transit
3. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for enhanced security)
4. **Password Requirements**: Minimum 6 characters (consider stronger requirements for production)
5. **Database**: Ensure PostgreSQL is properly secured and credentials are not exposed

## Migration Notes

### Existing Conversations
**Important**: Existing conversations in ChromaDB do not have a `userId` associated with them. They will need to be migrated or deleted:

**Option 1: Delete all existing conversations**
```bash
# Clear ChromaDB collection
bun run rag:clear
```

**Option 2: Migrate conversations to a default user**
You'll need to manually update the metadata in ChromaDB to add a `userId` field to existing conversations.

## Testing

1. **Create a new account**: Navigate to `/signup`
2. **Login**: Navigate to `/login`
3. **Start a conversation**: Verify it's saved and appears in your sidebar
4. **Logout and login as different user**: Verify you don't see the first user's conversations
5. **Test protected routes**: Try accessing `/conversations` without a token (should get 401)

## Future Enhancements

Consider implementing:
- Password reset functionality
- Email verification
- OAuth integration (Google, GitHub, etc.)
- Two-factor authentication
- User profile management
- Session management (revoke tokens)
- Rate limiting on auth endpoints
- Account deletion

