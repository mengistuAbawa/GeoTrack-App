const router = require('express').Router();
const { authenticate, requireUser, requireAdmin } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../controllers/authController');
const user = require('../controllers/userController');
const loc = require('../controllers/locationController');
const share = require('../controllers/sharingController');
const msg = require('../controllers/messageController');
const admin = require('../controllers/adminController');

// Public health check
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'GeoTrack API', time: new Date().toISOString() }));

// User Authentication
router.post('/auth/request-otp', asyncHandler(auth.requestOtp));
router.post('/auth/verify-otp', asyncHandler(auth.verifyOtp));

// User Profile
router.get('/users/me', authenticate, requireUser, asyncHandler(user.me));
router.patch('/users/me', authenticate, requireUser, asyncHandler(user.updateMe));
router.patch('/users/me/location-sharing', authenticate, requireUser, asyncHandler(user.setLocationSharing));

// User Location sync & history
router.post('/locations/sync', authenticate, requireUser, asyncHandler(loc.sync));
router.get('/locations/history', authenticate, requireUser, asyncHandler(loc.history));
router.get('/locations/shared-with-me', authenticate, requireUser, asyncHandler(loc.sharedWithMe));
router.get('/locations/shared/:userId/history', authenticate, requireUser, asyncHandler(loc.sharedHistory));

// Location Sharing
router.post('/sharing/requests', authenticate, requireUser, asyncHandler(share.request));
router.get('/sharing/requests/incoming', authenticate, requireUser, asyncHandler(share.incoming));
router.patch('/sharing/requests/:id/respond', authenticate, requireUser, asyncHandler(share.respond));
router.get('/sharing/contacts', authenticate, requireUser, asyncHandler(share.contacts));
router.delete('/sharing/contacts/:id', authenticate, requireUser, asyncHandler(share.revoke));

// Messaging
router.get('/messages/conversations', authenticate, requireUser, asyncHandler(msg.list));
router.post('/messages/conversations', authenticate, requireUser, asyncHandler(msg.create));
router.get('/messages/conversations/:id', authenticate, requireUser, asyncHandler(msg.messages));
router.post('/messages/conversations/:id', authenticate, requireUser, asyncHandler(msg.messages));

// --- ADMIN ROUTES ---
// Admin authentication
router.post('/admin/auth/login', asyncHandler(auth.adminLogin));

// Admin dashboard & stats
router.get('/admin/dashboard/stats', authenticate, requireAdmin, asyncHandler(admin.stats));

// Admin user management
router.get('/admin/users', authenticate, requireAdmin, asyncHandler(admin.users));
router.post('/admin/users', authenticate, requireAdmin, asyncHandler(admin.createUser));
router.patch('/admin/users/:id/status', authenticate, requireAdmin, asyncHandler(admin.setStatus));
router.delete('/admin/users/:id', authenticate, requireAdmin, asyncHandler(admin.deleteUser));

// Admin location shares
router.get('/admin/shares', authenticate, requireAdmin, asyncHandler(admin.shares));
router.patch('/admin/shares/:id/status', authenticate, requireAdmin, asyncHandler(admin.setShareStatus));

// Admin location tracking & history
router.get('/admin/locations', authenticate, requireAdmin, asyncHandler(admin.locations));
router.get('/admin/live-locations', authenticate, requireAdmin, asyncHandler(admin.liveLocations));

// Admin messages
router.get('/admin/messages', authenticate, requireAdmin, asyncHandler(admin.messages));

// Admin security & audit
router.get('/admin/audit-logs', authenticate, requireAdmin, asyncHandler(admin.audit));

// Admin system health & settings
router.get('/admin/system/health', authenticate, requireAdmin, asyncHandler(admin.systemHealth));
router.get('/admin/system/settings', authenticate, requireAdmin, asyncHandler(admin.getSettings));
router.patch('/admin/system/settings', authenticate, requireAdmin, asyncHandler(admin.updateSettings));
router.post('/admin/seed', authenticate, requireAdmin, asyncHandler(admin.seed));

module.exports = router;
