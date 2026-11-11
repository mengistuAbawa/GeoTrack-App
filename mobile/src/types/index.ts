// User and Authentication types
export interface User {
  id: string;
  phone: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OtpRequestPayload {
  phone: string;
}

export interface OtpVerifyPayload {
  phone: string;
  code: string;
}

// Device types
export interface Device {
  id: string;
  userId: string;
  deviceKey: string;
  platform: 'ios' | 'android';
  deviceName?: string;
  lastSeenAt: string;
}

// Location types
export interface LocationRecord {
  id: string;
  userId: string;
  clientRecordId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  recordedAt: string;
  receivedAt: string;
}

export interface LocationSyncPayload {
  records: Array<{
    clientRecordId: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    recordedAt: string;
  }>;
}

export interface LocationSyncResponse {
  message: string;
  received: number;
  processed: number;
}

// Location Sharing types
export interface LocationShare {
  id: string;
  ownerId: string;
  viewerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'revoked';
  shareHistory: boolean;
  expiresAt?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface SharingContact {
  id: string;
  fullName?: string;
  phone: string;
  shareId: string;
}

export interface SharingRequest {
  id: string;
  from: User;
  status: 'pending' | 'accepted' | 'rejected' | 'revoked';
  shareHistory: boolean;
  createdAt: string;
}

// Message types
export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

// Pagination
export interface PaginationParams {
  limit?: number;
  before?: string;
  offset?: number;
}

// Health Check
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  service: string;
  time: string;
}
