require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../src/config/db');

async function seed() {
  console.log('Seeding GeoTrack database with initial demo data...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Ensure admin user exists
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@geotrack.local').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
    const adminHash = await bcrypt.hash(adminPassword, 12);
    
    const adminRes = await client.query(
      `INSERT INTO admin_users(name, email, password_hash, role, status)
       VALUES($1, $2, $3, 'superadmin', 'active')
       ON CONFLICT(email) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id`,
      ['Mengistu Admin', adminEmail, adminHash]
    );
    const adminId = adminRes.rows[0].id;
    console.log(`Admin user ensured: ${adminEmail} (id: ${adminId})`);

    // 2. Demo users
    const sampleUsers = [
      { phone: '+251911223344', full_name: 'Abel Tesfaye', email: 'abel.tesfaye@example.com', status: 'active', city: 'Bole, Addis Ababa', lat: 8.9806, lng: 38.7578 },
      { phone: '+251922334455', full_name: 'Hana Mekonnen', email: 'hana.m@example.com', status: 'active', city: 'Kazanchis, Addis Ababa', lat: 9.0158, lng: 38.7667 },
      { phone: '+251933445566', full_name: 'Dawit Alemu', email: 'dawit.alemu@example.com', status: 'active', city: 'Bahir Dar, Amhara', lat: 11.5936, lng: 37.3908 },
      { phone: '+251944556677', full_name: 'Mimi Bekele', email: 'mimi.b@example.com', status: 'active', city: 'Adama, Oromia', lat: 8.5400, lng: 39.2700 },
      { phone: '+251955667788', full_name: 'Kebede Michael', email: 'kebede.m@example.com', status: 'active', city: 'Hawassa, Sidama', lat: 7.0504, lng: 38.4955 },
      { phone: '+251966778899', full_name: 'Selamawit Desta', email: 'selam.desta@example.com', status: 'active', city: 'Jimma, Oromia', lat: 7.6734, lng: 36.8344 },
      { phone: '+251977889900', full_name: 'Yohannes Tadesse', email: 'yohannes.t@example.com', status: 'suspended', city: 'Mekelle, Tigray', lat: 13.4967, lng: 39.4753 },
      { phone: '+251988990011', full_name: 'Aster Aweke', email: 'aster.a@example.com', status: 'active', city: 'Dire Dawa', lat: 9.6009, lng: 41.8501 },
      { phone: '+251999001122', full_name: 'Betelhem Girma', email: 'betelhem.g@example.com', status: 'active', city: 'Gondar, Amhara', lat: 12.6000, lng: 37.4667 }
    ];

    const insertedUsers = [];
    for (const u of sampleUsers) {
      const res = await client.query(
        `INSERT INTO users(phone, full_name, email, status)
         VALUES($1, $2, $3, $4)
         ON CONFLICT(phone) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, status = EXCLUDED.status
         RETURNING id, phone, full_name, email, status`,
        [u.phone, u.full_name, u.email, u.status]
      );
      insertedUsers.push({ ...res.rows[0], city: u.city, baseLat: u.lat, baseLng: u.lng });
    }
    console.log(`Ensured ${insertedUsers.length} users.`);

    // 3. User devices
    const deviceNames = ['Google Pixel 7', 'Samsung Galaxy A54', 'Xiaomi Redmi Note 12', 'iPhone 14 Pro', 'Tecno Camon 20'];
    for (let i = 0; i < insertedUsers.length; i++) {
      const user = insertedUsers[i];
      const dName = deviceNames[i % deviceNames.length];
      await client.query(
        `INSERT INTO devices(user_id, device_key, platform, device_name, last_seen_at)
         VALUES($1, $2, $3, $4, NOW() - ($5 || ' minutes')::interval)
         ON CONFLICT(user_id, device_key) DO UPDATE SET last_seen_at = EXCLUDED.last_seen_at, device_name = EXCLUDED.device_name`,
        [user.id, `dev-key-${user.id.slice(0, 8)}`, dName.includes('iPhone') ? 'ios' : 'android', dName, (i * 7).toString()]
      );
    }
    console.log('Ensured devices for users.');

    // 4. Location records (multiple history points for each user)
    let totalLocationCount = 0;
    for (const user of insertedUsers) {
      // 5 location points per user with slight variations over time
      for (let step = 0; step < 5; step++) {
        const clientRecId = crypto.randomUUID();
        const jitterLat = user.baseLat + (Math.random() - 0.5) * 0.015;
        const jitterLng = user.baseLng + (Math.random() - 0.5) * 0.015;
        const accuracy = Math.round(5 + Math.random() * 15);
        const altitude = Math.round(1800 + Math.random() * 500);
        const minutesAgo = (step * 30 + 5).toString();

        await client.query(
          `INSERT INTO location_records(user_id, client_record_id, latitude, longitude, accuracy, altitude, recorded_at, received_at)
           VALUES($1, $2, $3, $4, $5, $6, NOW() - ($7 || ' minutes')::interval, NOW() - ($7 || ' minutes')::interval)
           ON CONFLICT(user_id, client_record_id) DO NOTHING`,
          [user.id, clientRecId, jitterLat, jitterLng, accuracy, altitude, minutesAgo]
        );
        totalLocationCount++;
      }
    }
    console.log(`Generated ${totalLocationCount} location records.`);

    // 5. Location sharing sessions
    // Abel shares with Hana (accepted)
    // Hana shares with Abel (accepted)
    // Dawit shares with Abel (accepted)
    // Mimi shares with Hana (accepted)
    // Kebede shares with Selamawit (pending)
    // Aster shares with Betelhem (revoked)
    const sharesToCreate = [
      { ownerIdx: 0, viewerIdx: 1, status: 'accepted', shareHistory: true },
      { ownerIdx: 1, viewerIdx: 0, status: 'accepted', shareHistory: true },
      { ownerIdx: 2, viewerIdx: 0, status: 'accepted', shareHistory: false },
      { ownerIdx: 3, viewerIdx: 1, status: 'accepted', shareHistory: true },
      { ownerIdx: 4, viewerIdx: 5, status: 'pending', shareHistory: false },
      { ownerIdx: 7, viewerIdx: 8, status: 'revoked', shareHistory: false }
    ];

    for (const s of sharesToCreate) {
      const owner = insertedUsers[s.ownerIdx];
      const viewer = insertedUsers[s.viewerIdx];
      await client.query(
        `INSERT INTO location_shares(owner_id, viewer_id, status, share_history, created_at, responded_at)
         VALUES($1, $2, $3, $4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day')
         ON CONFLICT(owner_id, viewer_id) DO UPDATE SET status = EXCLUDED.status, share_history = EXCLUDED.share_history`,
        [owner.id, viewer.id, s.status, s.shareHistory]
      );
    }
    console.log('Ensured location sharing sessions.');

    // 6. Conversations & Messages
    if (insertedUsers.length >= 2) {
      const convRes = await client.query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
      const convId = convRes.rows[0].id;

      await client.query(
        `INSERT INTO conversation_participants(conversation_id, user_id)
         VALUES($1, $2), ($1, $3)
         ON CONFLICT DO NOTHING`,
        [convId, insertedUsers[0].id, insertedUsers[1].id]
      );

      const msgs = [
        { sender: insertedUsers[0].id, body: 'Hello Hana, sharing my location with you now for the meeting in Bole.' },
        { sender: insertedUsers[1].id, body: 'Received! I see you are near Edna Mall. See you shortly.' },
        { sender: insertedUsers[0].id, body: 'Traffic is light, should be there in 10 minutes.' }
      ];

      for (let i = 0; i < msgs.length; i++) {
        await client.query(
          `INSERT INTO messages(conversation_id, sender_id, body, created_at)
           VALUES($1, $2, $3, NOW() - ($4 || ' minutes')::interval)`,
          [convId, msgs[i].sender, msgs[i].body, ((3 - i) * 15).toString()]
        );
      }
      console.log('Ensured sample conversations and messages.');
    }

    // 7. Audit logs
    const auditLogs = [
      { action: 'admin.login', target_type: 'admin', target_id: adminId, ip: '127.0.0.1', meta: { user_agent: 'GeoTrack Admin Console' } },
      { action: 'user.registered', target_type: 'user', target_id: insertedUsers[0].id, ip: '197.156.104.22', meta: { phone: insertedUsers[0].phone } },
      { action: 'location.sync.batch', target_type: 'system', target_id: 'sync-4819', ip: '197.156.104.22', meta: { count: 184 } },
      { action: 'share.request.approved', target_type: 'share', target_id: insertedUsers[1].id, ip: '197.156.104.55', meta: { owner: insertedUsers[0].phone } },
      { action: 'user.status.changed', target_type: 'user', target_id: insertedUsers[6].id, ip: '127.0.0.1', meta: { old: 'active', new: 'suspended', reason: 'Unusual rapid requests' } },
      { action: 'security.review.completed', target_type: 'system', target_id: 'sec-audit-01', ip: '127.0.0.1', meta: { status: 'passed' } }
    ];

    for (const log of auditLogs) {
      await client.query(
        `INSERT INTO audit_logs(admin_id, action, target_type, target_id, ip_address, metadata, created_at)
         VALUES($1, $2, $3, $4, $5, $6, NOW() - ($7 || ' hours')::interval)`,
        [adminId, log.action, log.target_type, log.target_id, log.ip, JSON.stringify(log.meta), Math.floor(Math.random() * 24).toString()]
      );
    }
    console.log('Ensured sample audit logs.');

    await client.query('COMMIT');
    console.log('Database seeding successfully completed!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database seeding failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seed;
