import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { sharingService } from '@/services/sharingService';
import { SharingContact, SharingRequest } from '@/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { TextInput } from '@/components/TextInput';
import { typography, spacing, borderRadius } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ContactsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { showToast } = useNotification();
  const [contacts, setContacts] = useState<SharingContact[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<SharingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contacts' | 'requests'>('contacts');
  const [addContactVisible, setAddContactVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [contactsData, requestsData] = await Promise.all([
        sharingService.getTrustedContacts(),
        sharingService.getIncomingRequests(),
      ]);
      setContacts(contactsData);
      setIncomingRequests(requestsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await sharingService.respondToRequest(requestId, 'accepted');
      await loadData();
      showToast('Request accepted', ToastType.SUCCESS);
    } catch (error) {
      showToast('Failed to accept request', ToastType.ERROR);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await sharingService.respondToRequest(requestId, 'rejected');
      await loadData();
      showToast('Request rejected', ToastType.SUCCESS);
    } catch (error) {
      showToast('Failed to reject request', ToastType.ERROR);
    }
  };

  const handleRevoke = async (contactId: string) => {
    try {
      await sharingService.revokeContact(contactId);
      setContacts(contacts.filter((c) => c.shareId !== contactId));
      showToast('Access revoked', ToastType.SUCCESS);
    } catch (error) {
      showToast('Failed to revoke access', ToastType.ERROR);
    }
  };

  const handleRequestSharing = async () => {
    try {
      setSendingRequest(true);
      await sharingService.requestSharing(phone);
      setPhone('');
      setAddContactVisible(false);
      showToast('Sharing request sent. The person must approve it.', ToastType.SUCCESS);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to send sharing request';
      showToast(message, ToastType.ERROR);
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading contacts..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderBottomColor:
                activeTab === 'contacts' ? colors.primary : 'transparent',
              borderBottomWidth: activeTab === 'contacts' ? 2 : 0,
            },
          ]}
          onPress={() => setActiveTab('contacts')}
        >
          <Text
            style={[
              typography.subtitle2,
              {
                color:
                  activeTab === 'contacts' ? colors.primary : colors.gray[500],
              },
            ]}
          >
            Trusted Contacts ({contacts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderBottomColor:
                activeTab === 'requests' ? colors.primary : 'transparent',
              borderBottomWidth: activeTab === 'requests' ? 2 : 0,
            },
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <Text
            style={[
              typography.subtitle2,
              {
                color:
                  activeTab === 'requests'
                    ? colors.primary
                    : colors.gray[500],
              },
            ]}
          >
            Requests ({incomingRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'contacts' ? (
          <>
            {contacts.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="people-outline"
                  size={48}
                  color={colors.gray[300]}
                />
                <Text
                  style={[
                    typography.body2,
                    { color: colors.gray[500], marginTop: spacing[12] },
                  ]}
                >
                  No trusted contacts yet
                </Text>
              </View>
            ) : (
              <FlatList
                scrollEnabled={false}
                data={contacts}
                renderItem={({ item }) => (
                  <Card style={styles.contactCard}>
                    <View style={styles.contactHeader}>
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
                          {item.fullName || 'Unknown'}
                        </Text>
                        <Text style={[typography.caption, { color: colors.gray[500] }]}>
                          {item.phone}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRevoke(item.shareId)}
                      >
                        <MaterialIcons
                          name="more-vert"
                          size={20}
                          color={colors.gray[400]}
                        />
                      </TouchableOpacity>
                    </View>
                    <Button
                      title="Revoke Access"
                      onPress={() => handleRevoke(item.shareId)}
                      variant="ghost"
                      size="small"
                      style={{ marginTop: spacing[12], alignSelf: 'flex-start' }}
                    />
                  </Card>
                )}
                keyExtractor={(item) => item.shareId}
              />
            )}
          </>
        ) : (
          <>
            {incomingRequests.length === 0 ? (
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
                  No pending requests
                </Text>
              </View>
            ) : (
              <FlatList
                scrollEnabled={false}
                data={incomingRequests}
                renderItem={({ item }) => (
                  <Card style={styles.contactCard}>
                    <View style={styles.contactHeader}>
                      <View
                        style={[
                          styles.avatarSmall,
                          { backgroundColor: colors.accent },
                        ]}
                      >
                        <MaterialIcons
                          name="person-add"
                          size={16}
                          color={colors.white}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[typography.subtitle2, { color: colors.text }]}>
                          {item.from.fullName || 'Unknown'}
                        </Text>
                        <Text style={[typography.caption, { color: colors.gray[500] }]}>
                          {item.from.phone}
                        </Text>
                        {item.shareHistory && (
                          <Text
                            style={[
                              typography.caption,
                              { color: colors.info, marginTop: spacing[4] },
                            ]}
                          >
                            Also wants history access
                          </Text>
                        )}
                      </View>
                    </View>
                    <View
                      style={[
                        styles.buttonRow,
                        { gap: spacing[8], marginTop: spacing[12] },
                      ]}
                    >
                      <Button
                        title="Accept"
                        onPress={() => handleAccept(item.id)}
                        variant="primary"
                        size="small"
                        style={{ flex: 1 }}
                      />
                      <Button
                        title="Reject"
                        onPress={() => handleReject(item.id)}
                        variant="secondary"
                        size="small"
                        style={{ flex: 1 }}
                      />
                    </View>
                  </Card>
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Add Contact Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() => setAddContactVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Request location sharing by phone number"
        >
          <MaterialIcons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={addContactVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddContactVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalCard}>
            <Text style={[typography.h4, { color: colors.text }]}>
              Request location sharing
            </Text>
            <Text style={[typography.body2, { color: colors.gray[600], marginTop: spacing[8] }]}>
              Enter their GeoTrack phone number. They must approve before you can view their location.
            </Text>
            <TextInput
              label="Phone number"
              placeholder="+2519XXXXXXXX"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={{ marginTop: spacing[16] }}
            />
            <View style={[styles.buttonRow, { marginTop: spacing[16] }]}>
              <Button
                title="Cancel"
                onPress={() => setAddContactVisible(false)}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                title="Send request"
                onPress={handleRequestSharing}
                loading={sendingRequest}
                disabled={!phone.trim()}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
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
  contactCard: {
    marginBottom: spacing[12],
  },
  contactHeader: {
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
  buttonRow: {
    flexDirection: 'row',
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing[24],
    right: spacing[24],
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
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
});

export default ContactsScreen;
