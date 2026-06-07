# Smart Habit Tracker - Setup Guide

## Quick Start

1. **Backend Status**: ✅ Running at `http://localhost:5000`

2. **Frontend Setup**:
   ```bash
   cd frontend
   pnpm install
   pnpm run dev
   ```
   Open: http://localhost:3000

## First Time Setup

### Option 1: Register a New Account (Recommended)
1. Go to http://localhost:3000/register
2. Fill in the form:
   - Username: 3+ characters, letters/numbers/-/_
   - Email: your email
   - Password: 8+ chars with uppercase, lowercase, number, special char
   - Avatar: Optional - upload an image
3. Click "Sign Up"

### Option 2: Use Existing Account
1. Go to http://localhost:3000/login
2. Enter your credentials
3. Click "Sign In"

## API Error Troubleshooting

If you see "An error occurred" or "Unauthorized":

### 1. Check Backend Status
```bash
curl http://localhost:5000/
```
Should return: `{"success":true,"message":"Welcome to Smart Habit Tracker API"...}`

### 2. Register a New User
The error means you need to register. Go to `/register` and create an account.

### 3. Clear Local Storage
If you have old tokens:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Delete: `access_token`, `refresh_token`, `user`

### 4. Check Backend Logs
```bash
# Check if backend is running
curl http://localhost:5000/api/v1/health
```

## Features Available

- ✅ **Habits** - Create, edit, delete, track progress
- ✅ **Goals** - Set and track long-term goals
- ✅ **Achievements** - Unlock badges and rewards
- ✅ **Challenges** - Join community challenges
- ✅ **Analytics** - View detailed reports and patterns
- ✅ **Social** - Connect with friends, share progress
- ✅ **Profile** - Manage your account settings

## Navigation

From dashboard, use top menu:
- **Habits** - View and manage all habits
- **Goals** - Set and track goals
- **Achievements** - View your achievements
- **Challenges** - Join active challenges
- **Analytics** - View detailed analytics
- **Social** - Friends and leaderboard

## Day Toggle Behavior

⚠️ **Important**: You can only mark **today's** habit as complete.

The backend only supports toggling the current day. Past and future days are read-only for tracking purposes.

When you click a day:
- ✅ Today → Toggles completion
- ❌ Other days → Shows helpful message

## Support

For issues:
1. Make sure backend is running on port 5000
2. Register a new account
3. Clear browser cache if needed
