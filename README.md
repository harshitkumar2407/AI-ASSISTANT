# 🤖 AI Assistant - Complete Guide

A full-stack AI chat application with authentication, real-time messaging, and AI-powered responses.

## 📚 Documentation

All documentation is organized in the `/docs` folder. Here are the key files:

### Quick Start
- **[SETUP.md](./docs/SETUP.md)** - Step-by-step installation and setup
- **[ENV_VARIABLES.md](./docs/ENV_VARIABLES.md)** - Environment configuration reference

### System Documentation
- **[AUTH_FLOW.md](./docs/AUTH_FLOW.md)** - Complete authentication flow
- **[REQUIREMENTS.md](./docs/REQUIREMENTS.md)** - API endpoints and database schemas

### References
- **[FRONTEND_README.md](./docs/FRONTEND_README.md)** - Frontend-specific information
- **[EMAIL_DEBUG_REPORT.md](./docs/EMAIL_DEBUG_REPORT.md)** - Email setup troubleshooting
- **[FutureFeature.md](./docs/FutureFeature.md)** - Planned features and improvements

### Navigation
- **[INDEX.md](./docs/INDEX.md)** - Complete documentation index with all files listed

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Gmail account with App Password

### Installation

```bash
# Backend setup
cd Backend
npm install
cp .env.example .env  # Configure your environment
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`

---

## 📁 Project Structure

```
AI-ASSISTANT/
├── Backend/                    # Express.js + MongoDB
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth & validation
│   │   ├── services/          # Business logic (email, AI)
│   │   └── utils/             # Helper functions
│   ├── server.js              # Server entry point
│   └── package.json
│
├── frontend/                  # React 19 + Vite
│   ├── src/
│   │   ├── app/              # App component & routing
│   │   ├── features/         # Feature-based components
│   │   │   └── auth/         # Authentication pages
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API calls
│   │   └── main.jsx          # Entry point
│   └── package.json
│
└── docs/                      # All documentation
    ├── AUTH_FLOW.md
    ├── REQUIREMENTS.md
    ├── ARCHITECTURE.md
    └── ... (more guides)
```

---

## 🔐 Authentication Flow

```
User Registration
    ↓
Email Verification (JWT token)
    ↓
User Login
    ↓
JWT Token + HTTPOnly Cookie
    ↓
Access Protected Resources
```

### Key Features
- ✅ Email verification required before login
- ✅ Password hashing with bcryptjs
- ✅ JWT-based sessions (7-day expiry)
- ✅ HTTPOnly cookies for security
- ✅ Input validation on all endpoints

---

## 💻 API Endpoints

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create account |
| GET | `/api/auth/verify-email?token=...` | Verify email |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Chats (Protected)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chats` | Create new chat |
| GET | `/api/chats` | List user chats |
| DELETE | `/api/chats/:id` | Delete chat |

### Messages (Protected)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chats/:id/messages` | Send message |
| GET | `/api/chats/:id/messages` | Get messages |

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Dark Mode**: Default theme

### Typography
- Font Family: System fonts (San Francisco, Segoe UI, etc.)
- Base Font Size: 16px
- Line Height: 1.5

---

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **LangChain** - AI integration
- **Google Gemini** - AI model

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios/Fetch** - HTTP client

---

## 📖 Development Guide

### Adding New Features

1. **Backend**:
   - Create model in `src/models/`
   - Create controller in `src/controllers/`
   - Create routes in `src/routes/`
   - Add validation middleware if needed

2. **Frontend**:
   - Create component in `src/features/`
   - Add route in `src/app/app.routes.jsx`
   - Connect to API service
   - Add styling with Tailwind

### Environment Variables

See [ENV_VARIABLES.md](./docs/ENV_VARIABLES.md) for complete list.

Key variables:
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token signing key
- `GMAIL_USER` - Email sender
- `GMAIL_PASSWORD` - App-specific password

---

## 🧪 Testing

```bash
# Backend
cd Backend
npm test

# Frontend
cd frontend
npm run test
```

---

## 📝 License

ISC

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

---

## 📞 Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review existing GitHub issues
3. Create a new issue with details

---

## 📌 Last Updated

August 2026
