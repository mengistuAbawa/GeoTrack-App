CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), phone VARCHAR(20) UNIQUE NOT NULL,
 full_name VARCHAR(120), email VARCHAR(255), avatar_url TEXT,
 location_sharing_enabled BOOLEAN NOT NULL DEFAULT FALSE, location_sharing_updated_at TIMESTAMPTZ,
 status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended','deleted')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_sharing_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_sharing_updated_at TIMESTAMPTZ;
CREATE TABLE IF NOT EXISTS admin_users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(120) NOT NULL,
 email VARCHAR(255) UNIQUE NOT NULL, password_hash TEXT NOT NULL,
 role VARCHAR(30) NOT NULL DEFAULT 'admin', status VARCHAR(20) NOT NULL DEFAULT 'active',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS otp_verifications (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), phone VARCHAR(20) NOT NULL,
 code_hash TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL, attempts INT NOT NULL DEFAULT 0,
 consumed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS otp_phone_created_idx ON otp_verifications(phone, created_at DESC);
CREATE TABLE IF NOT EXISTS devices (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 device_key VARCHAR(160) NOT NULL, platform VARCHAR(30), device_name VARCHAR(120), last_seen_at TIMESTAMPTZ DEFAULT NOW(),
 UNIQUE(user_id, device_key)
);
CREATE TABLE IF NOT EXISTS location_records (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 client_record_id UUID NOT NULL, latitude DOUBLE PRECISION NOT NULL CHECK(latitude BETWEEN -90 AND 90),
 longitude DOUBLE PRECISION NOT NULL CHECK(longitude BETWEEN -180 AND 180), accuracy DOUBLE PRECISION,
 altitude DOUBLE PRECISION, recorded_at TIMESTAMPTZ NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(user_id, client_record_id)
);
CREATE INDEX IF NOT EXISTS location_history_idx ON location_records(user_id, recorded_at DESC);
CREATE TABLE IF NOT EXISTS location_shares (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected','revoked')),
 share_history BOOLEAN NOT NULL DEFAULT false, expires_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), responded_at TIMESTAMPTZ,
 UNIQUE(owner_id, viewer_id), CHECK(owner_id <> viewer_id)
);
CREATE TABLE IF NOT EXISTS conversations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS conversation_participants (
 conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 PRIMARY KEY(conversation_id,user_id)
);
CREATE TABLE IF NOT EXISTS messages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
 sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 5000), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), read_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages(conversation_id, created_at DESC);
CREATE TABLE IF NOT EXISTS audit_logs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
 action VARCHAR(120) NOT NULL, target_type VARCHAR(80), target_id TEXT, ip_address INET,
 metadata JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
