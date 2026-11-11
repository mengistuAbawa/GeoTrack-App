import api from '@/config/api';
import { LocationShare, SharingContact, SharingRequest } from '@/types';
import { logger } from '@/config/logger';

const TAG = 'SharingService';

export const sharingService = {
  requestSharing: async (
    viewerId: string,
    shareHistory: boolean = false
  ): Promise<LocationShare> => {
    try {
      const payload = {
        viewerId,
        shareHistory,
      };
      const response = await api.post<{ share: LocationShare }>('/sharing/requests', payload);
      logger.info(TAG, 'Sharing request sent');
      return response.data.share;
    } catch (error) {
      logger.error(TAG, 'Failed to send sharing request', error);
      throw error;
    }
  },

  getIncomingRequests: async (): Promise<SharingRequest[]> => {
    try {
      const response = await api.get<{ requests: SharingRequest[] }>('/sharing/requests/incoming');
      return response.data.requests;
    } catch (error) {
      logger.error(TAG, 'Failed to fetch incoming requests', error);
      throw error;
    }
  },

  respondToRequest: async (
    requestId: string,
    status: 'accepted' | 'rejected',
    shareHistory?: boolean
  ): Promise<LocationShare> => {
    try {
      const payload = {
        status,
        shareHistory,
      };
      const response = await api.patch<{ share: LocationShare }>(
        `/sharing/requests/${requestId}/respond`,
        payload
      );
      logger.info(TAG, 'Sharing request responded');
      return response.data.share;
    } catch (error) {
      logger.error(TAG, 'Failed to respond to sharing request', error);
      throw error;
    }
  },

  getTrustedContacts: async (): Promise<SharingContact[]> => {
    try {
      const response = await api.get<{ contacts: SharingContact[] }>('/sharing/contacts');
      return response.data.contacts;
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
