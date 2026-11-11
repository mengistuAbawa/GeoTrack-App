# GeoTrack Backend

Privacy-first location sharing API built with Node.js, Express, and PostgreSQL (CommonJS).

## Requirements
- Node.js 20+
- PostgreSQL 14+

## Setup (Windows CMD)
```bat
cd /d D:\your-project\geotrack-backend
npm install
copy .env.example .env
```
Create a PostgreSQL database named `geotrack`, then edit `.env` with your database credentials and a strong JWT secret (32+ characters).

```bat
npm run db:migrate
npm run admin:create
npm run dev
```
API health check: `http://localhost:5000/api/health`.

## OTP development mode
When `OTP_DEV_MODE=true`, the API returns `developmentCode` in the request response to make local testing possible. This is development-only. Before deployment set `OTP_DEV_MODE=false` and integrate a real SMS provider in `src/controllers/authController.js`. Do not deploy the development OTP response.

## Main API routes

| Method | Route | Auth |
|---|---|---|
| GET | `/api/health` | Public |
| POST | `/api/auth/request-otp` | Public |
| POST | `/api/auth/verify-otp` | Public |
| POST | `/api/admin/auth/login` | Public |
| GET/PATCH | `/api/users/me` | User |
| PATCH | `/api/users/me/location-sharing` | User, explicit opt-in |
| POST | `/api/locations/sync` | User |
| GET | `/api/locations/history` | User |
| GET | `/api/locations/shared-with-me` | User |
| GET | `/api/locations/shared/:userId/history` | Approved viewer, history consent required |
| POST | `/api/sharing/requests` | User |
| GET | `/api/sharing/requests/incoming` | User |
| PATCH | `/api/sharing/requests/:id/respond` | Location owner |
| GET | `/api/sharing/contacts` | User |
| DELETE | `/api/sharing/contacts/:id` | Location owner |
| GET/POST | `/api/messages/conversations` | User |
| GET/POST | `/api/messages/conversations/:id` | Conversation participant |
| GET | `/api/admin/dashboard/stats` | Admin |
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/locations` | Admin, consent-authorized records only |
| GET | `/api/admin/live-locations` | Admin, recent active shares only |
| PATCH | `/api/admin/users/:id/status` | Admin |
| GET | `/api/admin/audit-logs` | Admin |

## Example requests

Request OTP:
```json
{ "phone": "+2519XXXXXXXX" }
```
Verify OTP:
```json
{ "phone": "+2519XXXXXXXX", "code": "123456" }
```
Sync the signed-in user's own offline queue (generate a UUID for each clientRecordId and persist it locally until sync succeeds):
```json
{ "records": [{ "clientRecordId": "6b0b0b40-1f9a-4a8a-a5f3-7f4f0e5d0b21", "latitude": 9.03, "longitude": 38.74, "accuracy": 12, "recordedAt": "2026-11-10T08:30:00.000Z" }] }
```
Create a sharing request to a registered phone number:
```json
{ "phone": "+2519YYYYYYYY" }
```
The owner approves or rejects it using `PATCH /api/sharing/requests/:id/respond` with `{ "decision": "accepted", "shareHistory": false }`.

## Important privacy and production notes
- A phone number is an account identifier; it does not provide GPS coordinates.
- The mobile app must collect the signed-in user's own location only after clear permission and user consent. Store offline records locally and sync them using `/api/locations/sync` when connectivity returns.
- Never allow a caller to submit a different user's location. The sync endpoint always assigns records to the authenticated user.
- Location uploads require the user's explicit opt-in. The mobile app visibly sends GPS updates while sharing is on, and turning sharing off stops future uploads.
- The admin dashboard and mobile app must use the same backend/database. Configure the admin's `VITE_BACKEND_ORIGIN` and mobile's `EXPO_PUBLIC_API_BASE_URL` for the reachable backend address. Add browser origins to the comma-separated `CLIENT_ORIGIN`; native app requests are not subject to browser CORS.
- Admin live locations are limited to recent GPS updates received during the user's current sharing session. Location history is visible only while the user has sharing enabled.
- Configure SMS delivery, HTTPS, production CORS origins, database backups, monitoring, and stronger per-route rate limits before production. Set `OTP_DEV_MODE=false` and remove the development OTP response path before deployment.
