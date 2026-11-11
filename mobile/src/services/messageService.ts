import api from '@/config/api';
import { Conversation, Message } from '@/types';
import { logger } from '@/config/logger';

const TAG = 'MessageService';

interface ApiConversation {
  id: string;
  created_at: string;
  last_message?: string | null;
  last_message_at?: string | null;
}

interface ApiMessage {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at?: string | null;
}

const mapMessage = (message: ApiMessage, conversationId: string): Message => ({
  id: message.id,
  conversationId,
  senderId: message.sender_id,
  body: message.body,
  createdAt: message.created_at,
  readAt: message.read_at ?? undefined,
});

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get<{ conversations: ApiConversation[] }>('/messages/conversations');
      return response.data.conversations.map((conversation) => ({
        id: conversation.id,
        createdAt: conversation.created_at,
        lastMessageAt: conversation.last_message_at ?? undefined,
        lastMessage: conversation.last_message && conversation.last_message_at
          ? {
            body: conversation.last_message,
            createdAt: conversation.last_message_at,
          }
          : undefined,
      }));
    } catch (error) {
      logger.error(TAG, 'Failed to fetch conversations', error);
      throw error;
    }
  },

  createConversation: async (phone: string): Promise<string> => {
    try {
      const response = await api.post<{ conversationId: string }>(
        '/messages/conversations',
        { phone }
      );
      logger.info(TAG, 'Conversation created');
      return response.data.conversationId;
    } catch (error) {
      logger.error(TAG, 'Failed to create conversation', error);
      throw error;
    }
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    try {
      const response = await api.get<{ messages: ApiMessage[] }>(
        `/messages/conversations/${conversationId}`
      );
      return response.data.messages.map((message) => mapMessage(message, conversationId));
    } catch (error) {
      logger.error(TAG, 'Failed to fetch messages', error);
      throw error;
    }
  },

  sendMessage: async (conversationId: string, body: string): Promise<Message> => {
    try {
      const payload = { body };
      const response = await api.post<{ message: ApiMessage }>(
        `/messages/conversations/${conversationId}`,
        payload
      );
      logger.info(TAG, 'Message sent');
      return mapMessage(response.data.message, conversationId);
    } catch (error) {
      logger.error(TAG, 'Failed to send message', error);
      throw error;
    }
  },
};
