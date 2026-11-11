# GeoTrack Mobile — Phase 1
React Native CLI + TypeScript UI foundation for Android and iOS.

## Setup
1. Install Node.js, JDK 17, Android Studio/SDK. iOS builds require macOS + Xcode.
2. Create native project: `npx @react-native-community/cli@latest init GeoTrack --pm npm`
3. Copy this package's `src/` and `App.tsx` into the generated project.
4. Install: `npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context axios`
5. On macOS: `cd ios && pod install && cd ..`
6. Terminal 1: `npm start`; Terminal 2: `npm run android` or `npm run ios`.

Edit `src/config/api.ts` for your backend. Android emulator uses 10.0.2.2; iOS simulator uses localhost; physical devices need your computer's LAN IP. Use HTTPS in production.

Includes 14 screen foundations: Welcome, Register, OTP, Profile Setup, Home, Map, Contacts, History, Messages, Profile, Sharing Approval, Notifications, Offline Sync, Privacy Center. These are honest Phase 1 UI foundations; live auth, GPS, maps, messages, and sync are later phases. Recording is OFF by default and sharing requires approval.
