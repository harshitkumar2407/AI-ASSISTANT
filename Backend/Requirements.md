## Authentication System

## Chat with Ai

## Chat history

## Message Storage

## Ai with internet research 




---
 

# API Routes & Controllers

## 1. Database Models

| Entity | Fields |
|---|---|
| **User** | `_id`, `username`, `email`, `password` (hashed), `verified`, `createdAt`, `updatedAt` |
| **Chat** | `_id`, `user`, `title`, `createdAt`, `updatedAt` |
| **Message** | `_id`, `chat`, `content`, `role: [user, ai]`, `createdAt`, `updatedAt` |

---

## 2. Authentication Routes

|Checkbox| Method | Route | Controller | Purpose | Auth Required |
|---|---|---|---|---|---|
| -[ ] | `POST` | `/api/auth/register` | `register` | Create a new user account | ❌ |
| -[x] | `POST` | `/api/auth/login` | `login` | Authenticate user and create session/token | ❌ |
| -[ ] | `POST` | `/api/auth/logout` | `logout` | Logout the current user | ✅ |
| -[ ] | `GET` | `/api/auth/me` | `getCurrentUser` | Get currently authenticated user | ✅ |
| -[ ] | `POST` | `/api/auth/verify-email` | `verifyEmail` | Verify user's email | ❌ |
| -[ ] | `POST` | `/api/auth/forgot-password` | `forgotPassword` | Request password reset | ❌ |
| -[ ] | `POST` | `/api/auth/reset-password` | `resetPassword` | Set a new password | ❌ |

---

## 3. User Routes

| Method | Route | Controller | Purpose | Auth Required |
|---|---|---|---|---|
| `GET` | `/api/users/me` | `getProfile` | Get user's profile | ✅ |
| `PATCH` | `/api/users/me` | `updateProfile` | Update username/profile information | ✅ |
| `PATCH` | `/api/users/me/password` | `changePassword` | Change current user's password | ✅ |
| `DELETE` | `/api/users/me` | `deleteAccount` | Delete current user's account | ✅ |

---

## 4. Chat Routes

| Method | Route | Controller | Purpose | Auth Required |
|---|---|---|---|---|
| `POST` | `/api/chats` | `createChat` | Create a new chat | ✅ |
| `GET` | `/api/chats` | `getUserChats` | Get all chats belonging to the user | ✅ |
| `GET` | `/api/chats/:chatId` | `getChatById` | Get a specific chat | ✅ |
| `PATCH` | `/api/chats/:chatId` | `updateChat` | Update chat information/title | ✅ |
| `DELETE` | `/api/chats/:chatId` | `deleteChat` | Delete a chat | ✅ |

---

## 5. Message Routes

| Method | Route | Controller | Purpose | Auth Required |
|---|---|---|---|---|
| `POST` | `/api/chats/:chatId/messages` | `sendMessage` | Send a user message and generate/store AI response | ✅ |
| `GET` | `/api/chats/:chatId/messages` | `getMessages` | Get messages from a chat | ✅ |
| `GET` | `/api/chats/:chatId/messages/:messageId` | `getMessageById` | Get a specific message | ✅ |
| `DELETE` | `/api/chats/:chatId/messages/:messageId` | `deleteMessage` | Delete a specific message | ✅ |

---

## 6. Controller Structure

### Auth Controller

```text
auth.controller.js
├── register()
├── login()
├── logout()
├── getCurrentUser()
├── verifyEmail()
├── forgotPassword()
└── resetPassword()
```

### User Controller

```text
user.controller.js
├── getProfile()
├── updateProfile()
├── changePassword()
└── deleteAccount()
```

### Chat Controller

```text
chat.controller.js
├── createChat()
├── getUserChats()
├── getChatById()
├── updateChat()
└── deleteChat()
```

### Message Controller

```text
message.controller.js
├── sendMessage()
├── getMessages()
├── getMessageById()
└── deleteMessage()
```

---

## 7. Suggested Route Structure

```text
routes/
├── auth.routes.js
├── user.routes.js
├── chat.routes.js
└── message.routes.js
```

Corresponding controllers:

```text
controllers/
├── auth.controller.js
├── user.controller.js
├── chat.controller.js
└── message.controller.js
```

---

## 8. API Relationship

```text
User
 │
 ├── Register / Login
 │
 └── User
      │
      └── Chat
           │
           └── Message
                ├── user
                └── ai
```

### Main Flow

```text
Register
   ↓
Login
   ↓
Authenticated User
   ↓
Create Chat
   ↓
Send Message
   ↓
AI generates response
   ↓
Store User + AI Messages
   ↓
Return conversation
```

## 9. Implementation Rules

- Passwords must always be stored as **hashed passwords**, never plain text.
- Protected routes must use authentication middleware.
- A user must only be able to access their own chats.
- A user must only be able to access messages belonging to their own chats.
- Validate request body parameters before calling controllers.
- Controllers should handle HTTP request/response logic.
- Business logic should preferably be separated into services as the project grows.
- Use consistent HTTP status codes and error responses.
- `createdAt` and `updatedAt` should be managed automatically by the database/model layer where possible.