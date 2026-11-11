# GeoTrack Admin Dashboard

The GeoTrack admin dashboard uses the shared Express API for authentication, user management, and consent-authorized location data.

## Requirements
- Node.js 20+
- npm

## Run locally (Windows CMD)
```bat
cd /d D:\GeoTrack\admin
npm install
copy .env.example .env
npm run dev
```
Set `VITE_BACKEND_ORIGIN` in `.env` to the backend host if it is not `http://localhost:5000`. The `/api` requests are proxied by Vite. Open the local URL printed by Vite (normally http://localhost:5173).

## Build
```bat
npm run build
npm run preview
```

## Included
- Responsive sidebar, topbar, dashboard body and footer
- Overview metrics and charts
- Location monitoring map-style panel (visual placeholder, not a live map)
- Active location-sharing sessions
- Recent activity and synchronization status
- Responsive navigation for smaller screens

The backend and mobile app must point at the same PostgreSQL database. The live-location page shows GPS updates only while the signed-in user has explicitly enabled sharing in the mobile app; a phone number alone cannot provide location.
