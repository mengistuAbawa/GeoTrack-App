# GeoTrack Mobile - Installation Guide

## Step-by-Step Installation

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed
- Git (optional, for version control)

**Check your versions:**
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be v9.0.0 or higher
```

### Installation Steps

#### Step 1: Navigate to Mobile Project
```bash
cd d:\GeoTrack\mobile
```

#### Step 2: Clean Install (First Time)
```bash
# Remove any existing node_modules
rmdir /s /q node_modules
del package-lock.json

# Install fresh
npm install
```

**This will take 2-5 minutes.** You'll see output like:
```
added 500+ packages in 3m
```

#### Step 3: Verify Installation
```bash
# Check that node_modules exists
dir node_modules

# Verify expo is installed
npx expo --version
```

#### Step 4: Configure Environment
```bash
# Copy template
copy .env.example .env

# Edit .env with your backend URL
# Set: EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

#### Step 5: Start Development Server
```bash
npm start
```

**You should see:**
```
Expo DevTools running at http://localhost:19002
Expo Go app is ready at http://localhost:19000
```

#### Step 6: Run on Device/Simulator

**Option A - iOS Simulator:**
```bash
# In same terminal, press 'i'
# Or in new terminal:
npm run ios
```

**Option B - Android Emulator:**
```bash
# In same terminal, press 'a'
# Or in new terminal:
npm run android
```

**Option C - Physical Device:**
1. Install Expo Go app (from App Store or Play Store)
2. Scan QR code from terminal
3. App opens on device

---

## Troubleshooting Installation

### Issue: "npm: command not found"

**Solution**: Node.js/npm not installed or not in PATH
```bash
# Install Node.js from https://nodejs.org
# Then restart terminal
node --version
npm --version
```

### Issue: "npm ERR! code ERESOLVE"

**Solution**: Dependency conflict. Try:
```bash
npm install --legacy-peer-deps
```

### Issue: Installation very slow or stalled

**Solution**: Try alternative npm registry
```bash
npm install -g npm@latest
npm config set registry https://registry.npmjs.org/
npm install
```

### Issue: "Found: react@18.2.0 peer dep warning"

**Solution**: This is normal and expected. Continue with:
```bash
npm install --force
```

### Issue: EACCES permission error

**Solution (Windows)**: Run as Administrator
- Right-click Command Prompt
- Select "Run as Administrator"
- Then run npm install

### Issue: Module not found after install

**Solution**: Clear cache and reinstall
```bash
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue: Port 19000 or 19002 already in use

**Solution**: 
```bash
# Find what's using the port (Windows)
netstat -ano | findstr :19000
taskkill /PID <PID> /F

# Or use different port:
npm start -- --port 19001
```

---

## Verifying Installation

After npm install completes, verify:

### 1. Check node_modules exists
```bash
dir node_modules
# Should show many folders
```

### 2. Verify key packages
```bash
# Should all exist
dir node_modules\react
dir node_modules\expo
dir node_modules\@react-navigation
dir node_modules\axios
```

### 3. Run type checking
```bash
npm run type-check
# Should complete without errors
```

### 4. Run linter
```bash
npm run lint
# Should show 0 errors (warnings OK)
```

### 5. Test build
```bash
npm run prebuild
# Should complete without errors
```

---

## New Expo CLI

⚠️ **Important**: The old `expo` command is deprecated.

**Always use:**
```bash
npx expo <command>
```

**Examples:**
```bash
npx expo start          # Start dev server
npx expo start --ios    # iOS simulator
npx expo start --android # Android emulator
npx expo prebuild       # Prebuild native files
npx expo --version      # Check version
```

**Reasons:**
- Uses local expo from node_modules
- Ensures version compatibility
- Prevents global conflicts

---

## Development Server Options

### Option 1: Default (Recommended)
```bash
npm start
```
Then press:
- `i` for iOS
- `a` for Android
- `w` for Web

### Option 2: Specific Platform
```bash
npm run ios              # iOS simulator
npm run android         # Android emulator
npm run web            # Web version
```

### Option 3: Custom Port
```bash
npm start -- --port 19555
```

---

## After Installation

### 1. Verify Connection
```bash
npm start
# Wait for "Expo DevTools running at..."
```

### 2. Test Auth Flow
- Open app on simulator/device
- Enter phone: `+2519123456789`
- Enter OTP: `000000` (or from backend console)
- Complete profile
- See dashboard ✅

### 3. Check Console
- Look for any red errors
- API calls should show in logs
- No fatal errors should appear

---

## Development Workflow

```bash
# Terminal 1: Start dev server
npm start

# Terminal 2: Run specific platform
npm run ios
# or
npm run android
# or
npm run web
```

The app auto-reloads when you save files.

---

## First Time Setup Checklist

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Navigated to mobile directory
- [ ] Ran `npm install` (completed without errors)
- [ ] `.env` file edited with backend URL
- [ ] `npm start` runs successfully
- [ ] App opens on simulator/device
- [ ] Auth flow works
- [ ] No console errors

If all checked, you're ready to develop! 🚀

---

## Common Installation Times

| Step | Time |
|------|------|
| npm install | 2-5 min |
| First start | 30-60 sec |
| Prebuild native | 1-2 min |
| iOS simulator start | 30-60 sec |
| Android emulator start | 2-5 min |

**Total first-time setup: ~10-15 minutes**

---

## Getting Help

### Check Documentation
- GETTING_STARTED.md - Quick start
- README.md - Project overview
- SETUP.md - Detailed setup
- DEVELOPER_GUIDE.md - Development patterns

### Verify Installation
```bash
npm list react
npm list expo
npm list react-native
```

### Check Versions
```bash
npx expo --version
node --version
npm --version
```

### Test Backend Connection
```bash
# Try reaching backend API
curl http://localhost:5000/api/health
```

### Clean Install
```bash
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

---

## System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|------------|
| Node.js | 16.x | 18.x or higher |
| npm | 8.x | 9.x or higher |
| RAM | 4GB | 8GB+ |
| Disk | 2GB | 10GB+ |
| OS | Windows 10+ | Windows 11 |

---

## Next Steps

1. ✅ Complete installation
2. ✅ Verify all packages installed
3. ✅ Configure .env
4. ✅ Start dev server (`npm start`)
5. ✅ Test on device
6. → Read DEVELOPER_GUIDE.md for development patterns

---

## Quick Reference

```bash
# Setup
cd d:\GeoTrack\mobile
npm install
copy .env.example .env
# Edit .env with backend URL

# Development
npm start
# Press 'i' for iOS or 'a' for Android

# Troubleshooting
npm cache clean --force
npm install --legacy-peer-deps

# Check versions
node --version
npm --version
npx expo --version
```

---

Need help? Check the documentation files in the mobile directory.

Happy coding! 🚀
