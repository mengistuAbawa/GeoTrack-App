require('dotenv').config();
const fs = require('fs'); const path = require('path'); const pool = require('../src/config/db');
(async()=>{ try { const sql=fs.readFileSync(path.join(__dirname,'schema.sql'),'utf8'); await pool.query(sql); console.log('GeoTrack database migration completed.'); } catch(e){ console.error('Migration failed:',e.message); process.exitCode=1; } finally { await pool.end(); } })();
