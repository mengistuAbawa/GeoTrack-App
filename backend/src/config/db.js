require('dotenv').config();
const { Pool } = require('pg');
const config = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false } : { host:process.env.DB_HOST||'localhost', port:Number(process.env.DB_PORT||5432), user:process.env.DB_USER||'postgres', password:process.env.DB_PASS||'', database:process.env.DB_NAME||'geotrack' };
const pool = new Pool(config); pool.on('error', err => console.error('Unexpected PostgreSQL pool error:',err)); module.exports=pool;
