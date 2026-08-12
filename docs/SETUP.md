# Setup Guide

Complete installation and setup instructions for the AI Assistant project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v8.0.0 or higher (comes with Node.js)
- **MongoDB**: Local installation or MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git**: For version control ([Download](https://git-scm.com/))

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `Backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_specific_password

# Frontend
WEBSITE_DOMAIN=http://localhost:3000

# Google API (Optional)
GOOGLE_API_KEY=your_google_api_key
```

### 4. Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## Database Setup

### Option 1: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new account or login
3. Create a new project and cluster
4. Get your connection string
5. Add it to `Backend/.env` as `MONGODB_URI`

### Option 2: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux (Ubuntu)
sudo systemctl start mongod

# Windows
mongod
```

3. Set `MONGODB_URI` in `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/ai-assistant
```

---

## Email Configuration

### Gmail SMTP with App Password

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Select "App passwords"
   - Choose Mail and Windows Computer
   - Copy the generated password

3. Add to `.env`:

```env
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_specific_password
```

### Alternative: Gmail OAuth2

See [Email Configuration](./EMAIL_SETUP.md) for OAuth2 setup.

---

## Verification

### Test Backend Connection

```bash
# In Backend directory
npm run dev

# Check console output
✅ Server running on http://localhost:3000
✅ MongoDB connected
✅ Email transporter is ready
```

### Test Frontend Setup

```bash
# In frontend directory
npm run dev

# Check console output
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Test Email Sending

1. Register a new account
2. Check your email for verification link
3. Click the link to verify email
4. Login with your credentials

---

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Ensure MongoDB is running:

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start if not running
sudo systemctl start mongod
```

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution**: Change the PORT in `.env`:

```env
PORT=3001  # or any available port
```

### Email Not Sending

```
Error: 530 Authentication Required
```

**Solution**: Verify Gmail credentials:
- Check `GMAIL_PASSWORD` is an App Password, not your account password
- Ensure 2-Factor Authentication is enabled
- Verify the email address is correct

### Frontend Can't Connect to Backend

```
Error: Failed to fetch http://localhost:3000/api/auth/login
```

**Solution**: Ensure both servers are running:
```bash
# Terminal 1: Backend
cd Backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## Development Commands

### Backend

```bash
# Development server with hot reload
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Project Structure After Setup

```
AI-ASSISTANT/
├── Backend/
│   ├── src/
│   ├── .env              (Created)
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── .env              (Created)
│   ├── package.json
│   └── vite.config.js
│
├── docs/                 (Documentation)
└── README.md            (This file)
```

---

## Next Steps

1. **Create an account**: Register at `http://localhost:5173/register`
2. **Verify email**: Check your inbox and click verification link
3. **Login**: Sign in with your credentials
4. **Start chatting**: Create a new chat and start messaging with AI

---

## Getting Help

- Check [Troubleshooting](#troubleshooting) section
- Review [Environment Variables](./ENV_VARIABLES.md)
- See [Email Configuration](./EMAIL_SETUP.md)
- Check error messages in console

Happy coding! 🚀
