# GeoTrack Admin Dashboard

A responsive React + Vite + Tailwind CSS admin UI starter for GeoTrack.

## Requirements
- Node.js 20+
- npm

## Run locally (Windows CMD)
```bat
cd path\to\GeoTrack-Admin-Dashboard
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

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

## Important
This is a frontend UI prototype with sample data. It does not yet authenticate admins,
query phone numbers, access GPS, display real locations, or connect to a backend.
Connect it to the GeoTrack API only after backend authentication, role permissions,
and user-consented location-sharing endpoints are implemented.
