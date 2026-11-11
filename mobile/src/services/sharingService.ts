import api from '@/config/api';
import { SharingContact, SharingRequest } from '@/types';
import { logger } from '@/config/logger';

const TAG = 'SharingService';

interface ApiSharingRequest {
  id: string;
  status: SharingRequest['status'];
  created_at: string;
  requester_id: string;
  full_name: string | null;
  phone: string;
}

interface ApiSharingContact {
  share_id: string;
  id: string;
  full_name: string | null;
  phone: string;
}

export const sharingService = {
  requestSharing: async (
    phone: string
  ): Promise<void> => {
    try {
      await api.post('/sharing/requests', { phone });
      logger.info(TAG, 'Sharing request sent');
    } catch (error) {
      logger.error(TAG, 'Failed to send sharing request', error);
      throw error;
    }
  },

  getIncomingRequests: async (): Promise<SharingRequest[]> => {
    try {
      const response = await api.get<{ requests: ApiSharingRequest[] }>('/sharing/requests/incoming');
      return response.data.requests.map((request) => ({
        id: request.id,
        status: request.status,
        createdAt: request.created_at,
        shareHistory: false,
        from: {
          id: request.requester_id,
          phone: request.phone,
          fullName: request.full_name ?? undefined,
          status: 'active',
          createdAt: request.created_at,
        },
      }));
    } catch (error) {
      logger.error(TAG, 'Failed to fetch incoming requests', error);
      throw error;
    }
  },

  respondToRequest: async (
    requestId: string,
    status: 'accepted' | 'rejected',
    shareHistory: boolean = false
  ): Promise<void> => {
    try {
      await api.patch(
        `/sharing/requests/${requestId}/respond`,
        { decision: status, shareHistory }
      );
      logger.info(TAG, 'Sharing request responded');
    } catch (error) {
      logger.error(TAG, 'Failed to respond to sharing request', error);
      throw error;
    }
  },

  getTrustedContacts: async (): Promise<SharingContact[]> => {
    try {
      const response = await api.get<{ contacts: ApiSharingContact[] }>('/sharing/contacts');
      return response.data.contacts.map((contact) => ({
        id: contact.id,
        fullName: contact.full_name ?? undefined,
        phone: contact.phone,
        shareId: contact.share_id,
      }));
    } catch (error) {
      logger.error(TAG, 'Failed to fetch trusted contacts', error);
      throw error;
    }
  },

  revokeContact: async (contactId: string): Promise<void> => {
    try {
      await api.delete(`/sharing/contacts/${contactId}`);
      logger.info(TAG, 'Contact access revoked');
    } catch (error) {
      logger.error(TAG, 'Failed to revoke contact access', error);
      throw error;
    }
  },
};
