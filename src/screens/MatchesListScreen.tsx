import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, fontSize } from '../lib/theme';
import { RootStackParamList } from '../types';

type Props = {
  navigation: any;
};

// Mock data
const MOCK_MATCHES = [
  {
    id: '1',
    name: 'Sofia',
    lastMessage: 'Hey! Nice to finally chat 😊',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    time: '2m ago',
    unread: true,
  },
  {
    id: '2',
    name: 'Elena',
    lastMessage: 'That sounds like a great plan!',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    time: '1h ago',
    unread: false,
  },
  {
    id: '3',
    name: 'Maya',
    lastMessage: 'Would love to grab coffee sometime',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    time: 'Yesterday',
    unread: false,
  },
];

export default function MatchesListScreen({ navigation }: Props) {
  const renderMatch = ({ item }: { item: typeof MOCK_MATCHES[0] }) => (
    <TouchableOpacity
      style={styles.matchRow}
      onPress={() => navigation.navigate('Chat', { matchId: item.id, userName: item.name })}
    >
      <Image source={{ uri: item.photo }} style={styles.avatar} />
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{item.name}</Text>
          <Text style={styles.matchTime}>{item.time}</Text>
        </View>
        <Text
          style={[styles.lastMessage, item.unread && styles.unreadMessage]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      {MOCK_MATCHES.length > 0 ? (
        <FlatList
          data={MOCK_MATCHES}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptySubtitle}>
            When you and your mystery match both say yes, you'll be able to chat here.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl + spacing.lg,
  },
  header: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  matchName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  matchTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  lastMessage: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: '600',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
