import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { messageService } from '@/services/messageService';
import { Conversation, Message } from '@/types';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/Button';
import { TextInput as GeoTrackTextInput } from '@/components/TextInput';
import { typography, spacing, borderRadius } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MessagesScreen: React.FC = () => {
  const { colors } = useTheme();
  const { showToast } = useNotification();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newConversationVisible, setNewConversationVisible] = useState(false);
  const [participantPhone, setParticipantPhone] = useState('');
  const [creatingConversation, setCreatingConversation] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      setLoading(true);
      const convs = await messageService.getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      showToast('Failed to load conversations', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const msgs = await messageService.getMessages(conversationId);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load messages:', error);
      showToast('Failed to load messages', ToastType.ERROR);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      setSending(true);
      await messageService.sendMessage(selectedConversation.id, messageText);
      setMessageText('');
      await loadMessages(selectedConversation.id);
    } catch (error) {
      showToast('Failed to send message', ToastType.ERROR);
    } finally {
      setSending(false);
    }
  };

  const handleCreateConversation = async () => {
    try {
      setCreatingConversation(true);
      const conversationId = await messageService.createConversation(participantPhone);
      setParticipantPhone('');
      setNewConversationVisible(false);
      const conversation: Conversation = {
        id: conversationId,
        participants: [],
        createdAt: new Date().toISOString(),
      };
      setConversations((current) => [
        conversation,
        ...current.filter((item) => item.id !== conversationId),
      ]);
      setSelectedConversation(conversation);
      setMessages([]);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to start conversation';
      showToast(message, ToastType.ERROR);
    } finally {
      setCreatingConversation(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading messages..." />;
  }

  if (!selectedConversation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.listHeader}>
          <Text style={[typography.h4, { color: colors.text }]}>Conversations</Text>
          <TouchableOpacity
            onPress={() => setNewConversationVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Start a conversation by phone number"
          >
            <MaterialIcons name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          {conversations.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons
                name="mail-outline"
                size={48}
                color={colors.gray[300]}
              />
              <Text
                style={[
                  typography.body2,
                  { color: colors.gray[500], marginTop: spacing[12] },
                ]}
              >
                No conversations yet
              </Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={conversations}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedConversation(item);
                    loadMessages(item.id);
                  }}
                >
                  <Card style={styles.conversationCard}>
                    <View style={styles.conversationHeader}>
                      <View
                        style={[
                          styles.avatarSmall,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <MaterialIcons
                          name="person"
                          size={16}
                          color={colors.white}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[typography.subtitle2, { color: colors.text }]}>
                          Conversation
                        </Text>
                        <Text
                          style={[
                            typography.caption,
                            { color: colors.gray[500], marginTop: spacing[4] },
                          ]}
                          numberOfLines={1}
                        >
                          {item.lastMessage?.body || 'No messages'}
                        </Text>
                      </View>
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color={colors.gray[400]}
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </ScrollView>
        <Modal
          visible={newConversationVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setNewConversationVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <Card style={styles.modalCard}>
              <Text style={[typography.h4, { color: colors.text }]}>New conversation</Text>
              <GeoTrackTextInput
                label="GeoTrack phone number"
                placeholder="+2519XXXXXXXX"
                keyboardType="phone-pad"
                value={participantPhone}
                onChangeText={setParticipantPhone}
                style={{ marginTop: spacing[16] }}
              />
              <View style={styles.newConversationActions}>
                <Button
                  title="Cancel"
                  onPress={() => setNewConversationVisible(false)}
                  variant="secondary"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Start"
                  onPress={handleCreateConversation}
                  loading={creatingConversation}
                  disabled={!participantPhone.trim()}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.gray[200] }]}>
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[typography.subtitle1, { color: colors.text, flex: 1, marginLeft: spacing[12] }]}>
            Conversation
          </Text>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <View style={styles.emptyMessages}>
              <Text style={[typography.body2, { color: colors.gray[400] }]}>
                No messages yet
              </Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={messages}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageRow,
                    {
                      justifyContent: 'flex-start',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      {
                        backgroundColor: colors.gray[100],
                      },
                    ]}
                  >
                    <Text style={[typography.body2, { color: colors.text }]}>
                      {item.body}
                    </Text>
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: colors.gray[500],
                          marginTop: spacing[4],
                        },
                      ]}
                    >
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </ScrollView>

        {/* Input */}
        <View
          style={[
            styles.inputContainer,
            {
              borderTopColor: colors.gray[200],
              backgroundColor: colors.white,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.gray[300],
                color: colors.text,
              },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={colors.gray[400]}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={5000}
            editable={!sending}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!messageText.trim() || sending}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={messageText.trim() ? colors.primary : colors.gray[300]}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    borderBottomWidth: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[24],
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  modalCard: {
    padding: spacing[20],
  },
  newConversationActions: {
    flexDirection: 'row',
    gap: spacing[8],
    marginTop: spacing[16],
  },
  content: {
    flex: 1,
    padding: spacing[12],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[64],
  },
  conversationCard: {
    marginBottom: spacing[12],
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[12],
  },
  messagesContainer: {
    flex: 1,
    padding: spacing[12],
  },
  emptyMessages: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[32],
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing[12],
  },
  messageBubble: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[8],
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[12],
    borderTopWidth: 1,
    gap: spacing[8],
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[8],
    maxHeight: 100,
  },
});

export default MessagesScreen;
