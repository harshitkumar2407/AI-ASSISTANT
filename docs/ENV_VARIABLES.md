# Environment Variables Reference

Complete list of all environment variables used in the AI Assistant project.

## Backend Environment Variables

Create a `.env` file in the `Backend` directory with these variables:

### Server Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | number | `3000` | Server port number |
| `NODE_ENV` | string | `development` | Environment (development/production) |

**Example:**
```env
PORT=3000
NODE_ENV=development
```

---

### Database Configuration

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `MONGODB_URI` | string | ✅ Yes | MongoDB connection string |

**Format:**
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-assistant
```

**Getting MongoDB URI:**
1. **MongoDB Atlas**: Copy from cluster connection string
2. **Local**: `mongodb://localhost:27017/your_db_name`

---

### Authentication Configuration

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `JWT_SECRET` | string | ✅ Yes | Secret key for signing JWT tokens |

**Example:**
```env
JWT_SECRET=your_super_secret_key_with_minimum_32_characters_long
```

**Security Notes:**
- Use a strong, random string (minimum 32 characters)
- Never commit to version control
- Change regularly in production
- Use `openssl rand -hex 32` to generate

---

### Email Configuration

| Variable | Type | Required | Method | Description |
|----------|------|----------|--------|-------------|
| `GMAIL_USER` | string | ✅ Yes | App Password | Gmail account email |
| `GMAIL_PASSWORD` | string | ✅ Yes | App Password | Gmail App Password (16 chars) |

**App Password Method (Recommended):**
```env
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Setup Instructions:**
1. Enable 2-Factor Authentication on Google Account
2. Visit [Google Account Security](https://myaccount.google.com/security)
3. Select "App passwords"
4. Choose "Mail" and "Windows Computer"
5. Copy the generated 16-character password

**OAuth2 Method (Alternative):**
See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for OAuth2 configuration.

---

### Website Configuration

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `WEBSITE_DOMAIN` | string | ✅ Yes | Frontend domain for email links |

**Examples:**
```env
# Development
WEBSITE_DOMAIN=http://localhost:3000

# Production
WEBSITE_DOMAIN=https://yourdomain.com
```

---

### AI/Gemini Configuration

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `GOOGLE_API_KEY` | string | ❌ Optional | Google Gemini API key |

**Getting API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and add to .env

**Example:**
```env
GOOGLE_API_KEY=AIzaSyD...your_api_key
```

---

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with these variables:

### API Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_BASE_URL` | string | `http://localhost:3000` | Backend API base URL |

**Examples:**
```env
# Development
VITE_API_BASE_URL=http://localhost:3000

# Production
VITE_API_BASE_URL=https://api.yourdomain.com
```

**Usage in Code:**
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

---

## Complete .env Examples

### Backend .env (Development)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-assistant

# Authentication
JWT_SECRET=your_super_secret_key_with_minimum_32_characters_long

# Email
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx

# Website
WEBSITE_DOMAIN=http://localhost:3000

# Google API (Optional)
GOOGLE_API_KEY=AIzaSyD...your_api_key
```

### Backend .env (Production)

```env
# Server
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-assistant?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_production_key_with_minimum_32_characters

# Email
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx

# Website
WEBSITE_DOMAIN=https://yourdomain.com

# Google API
GOOGLE_API_KEY=AIzaSyD...your_api_key
```

### Frontend .env (Development)

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Frontend .env (Production)

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## Security Best Practices

### ❌ Don't

- Commit `.env` files to version control
- Use weak or default secrets
- Share secrets in logs or error messages
- Hardcode secrets in source code
- Use production secrets in development

### ✅ Do

- Create `.env` from `.env.example` template
- Use strong, random secrets (32+ characters)
- Store secrets in secure vaults
- Rotate secrets regularly
- Use different secrets per environment
- Review `.gitignore` includes `.env`

---

## Verification

### Test Backend Configuration

```bash
cd Backend
npm run dev

# Check output for:
✅ Server running on http://localhost:3000
✅ MongoDB connected
✅ Email transporter is ready
```

### Test Frontend Configuration

```bash
cd frontend
npm run dev

# Should connect to backend without errors
```

### Test API Connection

```bash
curl http://localhost:3000/api/auth/me
# Should return: {"message":"No token provided, authorization denied"}
```

---

## Troubleshooting

### "Missing credentials for PLAIN"

**Issue**: Email transporter not initialized with credentials

**Solution**: 
- Verify `GMAIL_USER` and `GMAIL_PASSWORD` are set
- Check `.env` file location
- Restart the server

### "MongoDB connection string is invalid"

**Issue**: Invalid `MONGODB_URI`

**Solution**:
- Check connection string format
- For MongoDB Atlas: Verify cluster access
- For local: Ensure MongoDB is running

### "JWT_SECRET is too short"

**Issue**: Weak JWT secret

**Solution**:
```bash
# Generate strong secret
openssl rand -hex 32
```

---

## Environment-Specific Settings

### Development

- `NODE_ENV=development`
- `PORT=3000` (or available port)
- Local MongoDB
- Verbose error logging

### Production

- `NODE_ENV=production`
- `PORT=443` or `80` (with reverse proxy)
- MongoDB Atlas
- Minimal error logging
- Strong JWT secrets

---

## Reference

- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [Google API Keys](https://cloud.google.com/docs/authentication/api-keys)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

Last updated: August 2026
