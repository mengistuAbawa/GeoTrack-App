# GeoTrack Mobile - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd d:\GeoTrack\mobile
npm install
```

⚠️ **Note on Expo CLI**: The legacy expo-cli is deprecated. The new Expo CLI is bundled in the expo package. After npm install, use:
```bash
npx expo <command>
# Instead of:
expo <command>
```

This will install:
- React Native and Expo runtime
- React Navigation for navigation
- Axios for API communication
- React Native Maps for geolocation
- Expo Location for background location tracking
- Expo Secure Store for secure token storage
- Expo SQLite for offline data storage
- TypeScript and development tools
- All 40+ dependencies specified in package.json

### 2. Configure Environment

Create a `.env` file in the `mobile/` directory:

```bash
cp .env.example .env
```

Edit `.env` to point to your backend:

```
EXPO_PUBLIC_API_BASE_URL=http://your-backend-domain/api
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_ENABLE_DEV_LOGGING=false
```

For local development:
- **iOS Simulator**: `http://localhost:5000/api`
- **Android Emulator**: `http://10.0.2.2:5000/api` (special Android emulator host alias)
- **Physical Device**: Use your machine's actual IP address

### 3. Run the App

**Start Expo dev server:**

```bash
npm start
```

**iOS Simulator:**

```bash
npm run ios
```

**Android Emulator/Device:**

```bash
npm run android
```

**Web (for testing):**

```bash
npm run web
```

### 4. Development Workflow

The app is structured with:

- **Screens** - Feature-based organization (auth, home, map, contacts, etc)
- **Services** - API communication layer with Axios
- **Context** - State management (Auth, Theme, Location, Notifications)
- **Components** - Reusable UI components with theming
- **Config** - Centralized configuration for API, logging, database

### 5. Backend Requirements

Ensure your backend is running and has these endpoints:

**Authentication:**
- `POST /auth/request-otp` - Request OTP for phone
- `POST /auth/verify-otp` - Verify OTP and get token

**Users:**
- `GET /users/me` - Get current user
- `PATCH /users/me` - Update user profile

**Locations:**
- `POST /locations/sync` - Sync recorded locations
- `GET /locations/history` - Get location history

**Sharing:**
- `POST /sharing/requests` - Send sharing request
- `GET /sharing/requests/incoming` - Get incoming requests
- `PATCH /sharing/requests/:id/respond` - Accept/reject request
- `GET /sharing/contacts` - Get trusted contacts
- `DELETE /sharing/contacts/:id` - Revoke access

**Messages:**
- `GET /messages/conversations` - List conversations
- `POST /messages/conversations` - Create conversation
- `GET /messages/conversations/:id` - Get messages
- `POST /messages/conversations/:id` - Send message

### 6. Permissions

The app requests these native permissions:

**iOS:**
- Location (foreground) - for live map
- Location (background) - for background recording
- Camera - for profile photos

**Android:**
- ACCESS_FINE_LOCATION - GPS location
- ACCESS_COARSE_LOCATION - Cell tower location
- ACCESS_BACKGROUND_LOCATION - Background tracking
- INTERNET - API communication

Users must grant these manually for the app to function.

### 7. Type Checking

Run TypeScript compiler to check for type errors:

```bash
npm run type-check
```

### 8. Linting

Check code quality:

```bash
npm run lint
```

### 9. Testing

Run tests:

```bash
npm test
```

Or in CI mode (single run):

```bash
npm run test:ci
```

## Architecture

### API Client

All API calls go through the centralized Axios instance at `src/config/api.ts`:

- Automatic JWT token injection
- Request/response interceptors
- Automatic token refresh on 401
- Rate limit retry with exponential backoff
- Error handling and logging

### Authentication Flow

1. User enters phone number
2. OTP is requested from backend
3. User enters 6-digit code
4. Backend verifies and returns JWT token
5. Token stored securely in Keystore/Keychain
6. User completes profile (optional)
7. Redirect to main app

### Location Recording

1. User starts recording on map screen
2. Background location permission is requested
3. Location updates are captured by Expo Location
4. Records stored locally in SQLite with unique UUIDs
5. On connectivity, records sync to backend
6. Backend returns success/failure for each record
7. Synced records marked complete locally

### Sharing Flow

1. User sends sharing request with contact phone
2. Request stored with `pending` status
3. Contact receives request in Requests tab
4. Contact accepts/rejects request
5. Status updated and synced
6. Approved sharing enables location visibility

### Messaging

Messages are fetched on-demand and displayed per conversation. Real-time Socket.IO support can be added for live updates.

## Troubleshooting

### "Cannot find module" errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### API connection failed

1. Check backend is running and accessible
2. Verify `.env` API URL is correct
3. On Android emulator, use `10.0.2.2` instead of `localhost`
4. Check firewall/VPN blocking API calls
5. Look at console logs: `npm start` will show network requests

### Location not working

1. Grant location permission in device settings
2. On iOS: Settings > GeoTrack > Location > Always
3. On Android: App > Permissions > Location
4. Enable location services globally on device

### Build errors

1. Clear Expo cache: `npm start -- --clear`
2. Remove `node_modules` and reinstall
3. Check Node.js version (16+)

### Styling/Theme issues

- Use the centralized `colors` and `typography` from `src/theme/`
- Use `useTheme()` hook to access theme data
- Dark mode is handled automatically based on system preference

## Next Steps

### Phase 3: GPS & Background Location

Implement real location tracking using Expo Location and Background Tasks.

### Phase 4: Offline Sync

Expand SQLite storage for comprehensive offline support with conflict resolution.

### Phase 5: Real-time Updates

Add Socket.IO for live messaging and location updates.

### Phase 6: Testing

Add unit and integration tests for critical flows.

### Phase 7: Performance & Security Audit

Profile app performance, optimize bundle size, conduct security review.

## Resources

- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
