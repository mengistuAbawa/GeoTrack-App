import api from '@/config/api';
import { Conversation, Message } from '@/types';
import { logger } from '@/config/logger';

const TAG = 'MessageService';

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get<{ conversations: Conversation[] }>('/messages/conversations');
      return response.data.conversations;
    } catch (error) {
      logger.error(TAG, 'Failed to fetch conversations', error);
      throw error;
    }
  },

  createConversation: async (participantIds: string[]): Promise<Conversation> => {
    try {
      const payload = { participantIds };
      const response = await api.post<{ conversation: Conversation }>(
        '/messages/conversations',
        payload
      );
      logger.info(TAG, 'Conversation created');
      return response.data.conversation;
    } catch (error) {
      logger.error(TAG, 'Failed to create conversation', error);
      throw error;
    }
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    try {
      const response = await api.get<{ messages: Message[] }>(
        `/messages/conversations/${conversationId}`
      );
      return response.data.messages;
    } catch (error) {
      logger.error(TAG, 'Failed to fetch messages', error);
      throw error;
    }
  },

  sendMessage: async (conversationId: string, body: string): Promise<Message> => {
    try {
      const payload = { body };
      const response = await api.post<{ message: Message }>(
        `/messages/conversations/${conversationId}`,
        payload
      );
      logger.info(TAG, 'Message sent');
      return response.data.message;
    } catch (error) {
      logger.error(TAG, 'Failed to send message', error);
      throw error;
    }
  },
};
