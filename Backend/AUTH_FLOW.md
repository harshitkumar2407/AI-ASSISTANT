# 🔐 Complete Authentication Flow Documentation

## Overview
Complete authentication system: Registration → Email Verification → Login → Protected Routes

---

## 📝 Registration Flow

### Flow Diagram
```
User Data → Validate → Create User → Generate JWT → Send Email → Response
```

### Step 1: POST /api/auth/register
**Endpoint:** `POST /api/auth/register`

User sends registration data:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123",
  "confirmPassword": "Test123"
}
```

### Step 2: ✓ Validation Middleware
**File:** `src/middleware/validation.middleware.js`

registerValidator checks:
- **username**: minimum 3 characters, alphanumeric + underscore only
- **email**: valid email format
- **password**: minimum 6 characters, at least 1 uppercase, 1 lowercase, 1 digit
- **confirmPassword**: must exist

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Username must be at least 3 characters",
      "param": "username"
    }
  ]
}
```

### Step 3: ✓ Check Passwords Match
**File:** `src/controllers/auth.controller.js` (line 25-30)

```javascript
if (password !== confirmPassword) {
  return res.status(400).json({
    success: false,
    message: "Passwords do not match",
  });
}
```

**Error Response (400):** Passwords do not match

### Step 4: ✓ Check User Exists
**File:** `src/controllers/auth.controller.js` (line 33-35)

Query database using MongoDB `$or` operator:
```javascript
const userExists = await UserModel.findOne({
  $or: [{ email }, { username }],
});
```

**Error Response (409):** User already exists with this email or username

### Step 5: ✓ Create User in Database
**File:** `src/models/user.model.js`

User created with auto-hashing via Mongoose pre-save hook:
```javascript
const user = await UserModel.create({
  username,
  email,
  password,  // auto-hashed by pre-save hook
});
```

**User fields:**
- `username`: unique, lowercase
- `email`: unique, lowercase
- `password`: hashed using bcryptjs, NOT selected by default
- `verified`: false (default)
- `createdAt`, `updatedAt`: timestamps

### Step 6: ✓ Generate Email Verification JWT
**File:** `src/controllers/auth.controller.js` (line 51-55)

```javascript
const verificationToken = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }  // Expires in 1 day
);
```

**Token payload:**
- `userId`: user's MongoDB _id
- `iat`: issued at timestamp
- `exp`: expires at (1 day from now)

### Step 7: ✓ Send Verification Email
**File:** `src/controllers/auth.controller.js` (line 58-74)

Sends email with verification link:
```
${WEBSITE_DOMAIN}/verify-email?token=JWT_TOKEN
```

**Default:** `http://localhost:3000/verify-email?token=...`

**Email Services:**
- `src/services/mail.service.js` - Low-level nodemailer wrapper
- `src/utils/email.js` - High-level wrapper with validation

**Error Handling:** Email failure doesn't block registration (try-catch continues)

### Step 8: ✓ Return Success Response
**Status:** 201 Created

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "verified": false
  }
}
```

### Registration Status Codes

| Code | Status | Reason |
|------|--------|--------|
| **201** | ✅ Created | User registered successfully |
| **400** | ❌ Bad Request | Validation failed OR passwords don't match |
| **409** | ❌ Conflict | User already exists with this email/username |
| **500** | ❌ Server Error | Database or server error |

---

## 📧 Email Verification Flow

### Flow Diagram
```
Click Link → Verify JWT → Find User → Mark Verified → Success Page
```

### Step 1: GET /api/auth/verify-email?token=JWT
**Endpoint:** `GET /api/auth/verify-email?token=JWT_TOKEN`

User clicks verification link from email (public route, no auth required)

```
http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiIs...
```

### Step 2: ✓ Verify JWT Token
**File:** `src/controllers/auth.controller.js` (line 123)

```javascript
const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
```

**Verification checks:**
- Token signature is valid
- Token is not expired (1 day from issue)
- JWT_SECRET matches

**Error:** Invalid or expired token → 500 Error page

### Step 3: ✓ Decode & Extract User ID
Extracts `userId` from decoded JWT payload

```javascript
const userId = decodedToken.userId;
const user = await UserModel.findById(userId);
```

**Error:** User not found → 404

### Step 4: ✓ Check If Already Verified
**File:** `src/controllers/auth.controller.js` (line 135-140)

```javascript
if (user.verified) {
  return res.status(400).json({
    success: false,
    message: "Email is already verified",
  });
}
```

### Step 5: ✓ Mark Email as Verified
**File:** `src/controllers/auth.controller.js` (line 143-144)

```javascript
user.verified = true;
await user.save();
```

### Step 6: ✓ Return HTML Success Page
**Status:** 200 OK

Returns HTML page (not JSON) displayed in browser:
```html
<html>
  <head>
    <title>Email Verified</title>
  </head>
  <body>
    <h1 style="color: green;">Email verified successfully!</h1>
    <p>Your email has been verified. You can now log in to your account.</p>
  </body>
</html>
```

### Email Verification Status Codes

| Code | Status | Reason |
|------|--------|--------|
| **200** | ✅ OK | Email verified successfully, HTML page returned |
| **400** | ❌ Bad Request | Email already verified |
| **500** | ❌ Error | Invalid/expired token OR user not found |

---

## 🔑 Login Flow

### Flow Diagram
```
Email/Username → Find User → Verify Password → Check Verified → Generate JWT → Set Cookie → Response
```

### Step 1: POST /api/auth/login
**Endpoint:** `POST /api/auth/login`

User sends credentials:
```json
{
  "email": "test@example.com",
  "password": "Test123"
}
```

**OR with username:**
```json
{
  "username": "testuser",
  "password": "Test123"
}
```

### Step 2: ✓ Validation Middleware
**File:** `src/middleware/validation.middleware.js`

loginValidator checks:
- **email**: valid email format (if provided)
- **password**: must not be empty

**Error Response (400):** Validation failed

### Step 3: ✓ Find User by Email OR Username
**File:** `src/controllers/auth.controller.js` (line 191-196)

MongoDB `$or` query to find user by either email OR username:
```javascript
const user = await UserModel.findOne({
  $or: [
    { email: email },
    { username: username }
  ]
}).select("+password");  // Include password (normally hidden)
```

**Why `.select("+password")`:** Password is excluded by default in schema (`select: false`), must explicitly include for login

**Error (404):** User not found

### Step 4: ✓ Verify Password
**File:** `src/controllers/auth.controller.js` (line 206)

```javascript
const isMatch = await user.matchPassword(password);
```

**matchPassword method** in User model:
```javascript
matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
}
```

Compares plaintext password with bcryptjs hashed password

**Error (401):** Invalid Email or password

### Step 5: ✓ Check Email Verified
**File:** `src/controllers/auth.controller.js` (line 213-218)

```javascript
if (!user.verified) {
  return res.status(403).json({
    success: false,
    message: "Email not verified. Please verify your email before logging in.",
  });
}
```

**Error (403):** Email not verified - must verify email first

### Step 6: ✓ Generate JWT Token
**File:** `src/controllers/auth.controller.js` (line 219-224)

```javascript
const token = jwt.sign({
  userId: user._id,
  username: user.username
},
process.env.JWT_SECRET,
{
  expiresIn: "7d"  // Expires in 7 days
});
```

**Token payload:**
- `userId`: user's MongoDB _id
- `username`: user's username
- `exp`: expires in 7 days

### Step 7: ✓ Set HTTPOnly Cookie
**File:** `src/controllers/auth.controller.js` (line 226-231)

```javascript
res.cookie("token", token, {
  httpOnly: true,              // Not accessible to JavaScript (XSS protection)
  secure: NODE_ENV === "production",  // HTTPS only in production
  sameSite: "strict",           // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
});
```

### Step 8: ✓ Return Login Response
**Status:** 200 OK

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "verified": true
  }
}
```

### Login Status Codes

| Code | Status | Reason |
|------|--------|--------|
| **200** | ✅ OK | Login successful, token and cookie set |
| **400** | ❌ Bad Request | Validation failed |
| **401** | ❌ Unauthorized | Invalid password |
| **403** | ❌ Forbidden | Email not verified |
| **404** | ❌ Not Found | User not found |

---

## 👤 Get Current User (Protected Route)

### Flow Diagram
```
Request with Token → Auth Middleware → Verify JWT → Find User → Return Profile
```

### Step 1: GET /api/auth/me
**Endpoint:** `GET /api/auth/me`

Protected route - requires valid JWT token

**Token can be sent via:**
1. **Cookie** (auto-sent by browser): `token=JWT_TOKEN`
2. **Authorization Header**: `Authorization: Bearer JWT_TOKEN`

### Step 2: ✓ Auth Middleware Check
**File:** `src/middleware/auth.middleware.js`

```javascript
export function authUser(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
}
```

**Error (401):** No token provided
**Error (401):** Invalid or expired token

### Step 3: ✓ User Attached to Request
Decoded JWT payload attached to `req.user`:
```javascript
req.user = {
  userId: "507f1f77bcf86cd799439011",
  username: "testuser"
}
```

### Step 4: ✓ Find User & Return Profile
**File:** `src/controllers/auth.controller.js` (line 261)

```javascript
const user = await UserModel.findById(userId).select('-password');
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "verified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

### Protected Route Status Codes

| Code | Status | Reason |
|------|--------|--------|
| **200** | ✅ OK | User profile returned |
| **401** | ❌ Unauthorized | No token or invalid token |
| **404** | ❌ Not Found | User not found |

---

## 🔒 Security Features

### Password Security
- ✅ **Bcryptjs hashing** - One-way encryption, cannot be reversed
- ✅ **Pre-save hook** - Password hashed automatically before saving
- ✅ **Select: false** - Password excluded from queries by default
- ✅ **matchPassword method** - Safe password comparison

### JWT Security
- ✅ **Expiration times** - Tokens expire (email: 1 day, session: 7 days)
- ✅ **JWT_SECRET** - Unique secret from environment variables
- ✅ **Signature verification** - Token tampering detected

### Cookie Security
- ✅ **HTTPOnly** - Not accessible to JavaScript (XSS protection)
- ✅ **Secure flag** - HTTPS only in production
- ✅ **SameSite: strict** - CSRF protection

### Input Validation
- ✅ **Express-validator** - All fields validated
- ✅ **Email format** - Valid email required
- ✅ **Password strength** - Min 6 chars, uppercase, lowercase, digit
- ✅ **Username format** - 3+ chars, alphanumeric + underscore

### Account Verification
- ✅ **Email verification required** - Must verify before login
- ✅ **Verification link expiration** - 1 day token expiration
- ✅ **One-time link** - Can't verify twice

### Protected Routes
- ✅ **Auth middleware** - Checks token before allowing access
- ✅ **User data isolation** - Users can only access their own data
- ✅ **Password excluded** - Never sent in responses

---

## 📊 Complete Flow Summary

### 1️⃣ Registration
```
User fills form → POST /api/auth/register
  → Validation ✓
  → Check duplicate ✓
  → Create user with hashed password ✓
  → Generate verification JWT ✓
  → Send verification email ✓
  → Return created user (verified: false) ✓
```

### 2️⃣ Email Verification
```
User clicks email link → GET /api/auth/verify-email?token=JWT
  → Verify JWT signature ✓
  → Extract userId from token ✓
  → Find user ✓
  → Mark verified: true ✓
  → Return HTML success page ✓
```

### 3️⃣ Login
```
User enters credentials → POST /api/auth/login
  → Validate input ✓
  → Find user by email/username ✓
  → Verify password ✓
  → Check email verified ✓
  → Generate 7-day JWT ✓
  → Set HTTPOnly cookie ✓
  → Return token + user data ✓
```

### 4️⃣ Access Protected Resources
```
User requests → GET /api/auth/me (with token)
  → Auth middleware extracts token ✓
  → Verify JWT signature ✓
  → Attach user to request ✓
  → Return user profile ✓
```

---

## 🗂️ File Structure

```
src/
├── routes/
│   └── auth.routes.js          # Route definitions
├── middleware/
│   ├── validation.middleware.js # Input validation
│   └── auth.middleware.js       # JWT verification
├── controllers/
│   └── auth.controller.js       # Business logic
├── models/
│   ├── user.model.js            # User schema
│   ├── chat.model.js
│   └── message.model.js
├── services/
│   └── mail.service.js          # Email sending
└── utils/
    └── email.js                 # Email wrapper
```

---

## 🔍 Verification Checklist

- [x] Registration validates all fields
- [x] Password hashed before save
- [x] Email uniqueness checked
- [x] Username uniqueness checked
- [x] Email verification token generated
- [x] Verification email sent
- [x] Email verification link works
- [x] User marked verified on click
- [x] Login requires verified email
- [x] Password comparison uses bcryptjs
- [x] JWT token generated on login
- [x] HTTPOnly cookie set
- [x] Auth middleware checks token
- [x] Protected routes require auth
- [x] Proper HTTP status codes used
- [x] All error messages clear

---

## 🚀 Ready to Use!

The authentication system is complete and ready for:
- User registration with email verification
- Secure password storage
- JWT-based authentication
- Protected API routes
- User profile access

Test the complete flow from registration to accessing protected resources! ✅