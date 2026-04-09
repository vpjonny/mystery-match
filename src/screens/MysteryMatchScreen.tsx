import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../lib/theme';
import { MysteryMatch } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.xl * 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

// Mock data for demo
const MOCK_MATCH: MysteryMatch = {
  id: '1',
  matchedUserId: '2',
  matchedUser: {
    id: '2',
    name: 'Sofia',
    age: 28,
    bio: 'Coffee addict, book lover, and sunset chaser. Looking for someone who can make me laugh and isn\'t afraid of deep conversations at 2am.',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
    location: { lat: 42.69, lng: 23.32 },
    preferences: { ageMin: 25, ageMax: 35, maxDistance: 50, gender: 'male' },
    gender: 'female',
    createdAt: new Date().toISOString(),
  },
  revealLevel: 0,
  interactions: 0,
  status: 'pending',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
};

export default function MysteryMatchScreen() {
  const [match, setMatch] = useState<MysteryMatch | null>(MOCK_MATCH);
  const [timeLeft, setTimeLeft] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;

  // Countdown timer
  useEffect(() => {
    if (!match) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(match.expiresAt).getTime();
      const diff = expires - now;
      if (diff <= 0) {
        setMatch((prev) => prev ? { ...prev, status: 'expired' } : null);
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [match]);

  // Entry animation
  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  // Pulse animation for the mystery icon
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleInteract = () => {
    if (!match) return;
    const newInteractions = match.interactions + 1;
    const newRevealLevel = Math.min(3, Math.floor(newInteractions / 1)) as 0 | 1 | 2 | 3;

    Animated.timing(revealAnim, {
      toValue: newRevealLevel,
      duration: 800,
      useNativeDriver: false,
    }).start();

    setMatch({
      ...match,
      interactions: newInteractions,
      revealLevel: newRevealLevel,
    });
  };

  const handleAccept = () => {
    if (!match) return;
    setMatch({ ...match, status: 'accepted' });
  };

  const handlePass = () => {
    if (!match) return;
    setMatch({ ...match, status: 'rejected' });
  };

  const getBlurAmount = (): number => {
    if (!match) return 50;
    switch (match.revealLevel) {
      case 0: return 50;
      case 1: return 25;
      case 2: return 5;
      case 3: return 0;
      default: return 50;
    }
  };

  const getRevealLabel = (): string => {
    if (!match) return '';
    switch (match.revealLevel) {
      case 0: return 'Tap to start revealing...';
      case 1: return 'Getting clearer...';
      case 2: return 'Almost there...';
      case 3: return 'Fully revealed!';
      default: return '';
    }
  };

  if (!match) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Animated.Text style={[styles.mysteryIcon, { transform: [{ scale: pulseAnim }] }]}>
            ❓❤️
          </Animated.Text>
          <Text style={styles.emptyTitle}>No Match Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your next mystery match arrives tomorrow.{'\n'}Check back soon!
          </Text>
        </View>
      </View>
    );
  }

  if (match.status === 'expired') {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.expiredIcon}>⏳</Text>
          <Text style={styles.emptyTitle}>Match Expired</Text>
          <Text style={styles.emptySubtitle}>
            This match has expired.{'\n'}A new mystery awaits tomorrow!
          </Text>
        </View>
      </View>
    );
  }

  if (match.status === 'accepted') {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.heartIcon}>💜</Text>
          <Text style={styles.emptyTitle}>Interest Sent!</Text>
          <Text style={styles.emptySubtitle}>
            If {match.matchedUser.name} is interested too,{'\n'}chat will unlock!
          </Text>
        </View>
      </View>
    );
  }

  const blurRadius = getBlurAmount();

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerBar}>
        <Text style={styles.timerIcon}>⏱</Text>
        <Text style={styles.timerText}>{timeLeft}</Text>
      </View>

      {/* Match Card */}
      <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>
        {/* Photo with blur */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: match.matchedUser.photos[0] }}
            style={styles.photo}
            blurRadius={blurRadius}
          />

          {/* Overlay gradient */}
          <View style={styles.photoOverlay} />

          {/* Reveal level indicator */}
          <View style={styles.revealBadge}>
            <View style={styles.revealDots}>
              {[0, 1, 2, 3].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.dot,
                    level <= match.revealLevel && styles.dotActive,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.revealText}>{getRevealLabel()}</Text>
          </View>

          {/* Name (always visible) */}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{match.matchedUser.name}</Text>
            {match.revealLevel >= 1 && (
              <Text style={styles.age}>, {match.matchedUser.age}</Text>
            )}
          </View>
        </View>

        {/* Bio section - revealed at level 2+ */}
        {match.revealLevel >= 2 && (
          <View style={styles.bioSection}>
            <Text style={styles.bio}>{match.matchedUser.bio}</Text>
          </View>
        )}

        {/* Interaction button */}
        <TouchableOpacity
          style={styles.interactButton}
          onPress={handleInteract}
          disabled={match.revealLevel >= 3}
        >
          <Text style={styles.interactText}>
            {match.revealLevel >= 3 ? 'Fully Revealed ✓' : '❓❤️ Tap to Reveal More'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Text style={styles.passIcon}>✕</Text>
          <Text style={styles.actionLabel}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptIcon}>♥</Text>
          <Text style={styles.actionLabel}>Interested</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl + spacing.lg,
  },
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  timerIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  timerText: {
    color: colors.warning,
    fontSize: fontSize.md,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  card: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  photoContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT * 0.65,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  revealBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
  },
  revealDots: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  revealText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  nameContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  name: {
    color: '#fff',
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  age: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  bioSection: {
    padding: spacing.md,
  },
  bio: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  interactButton: {
    backgroundColor: colors.surfaceLight,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  interactText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  passButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passIcon: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '300',
  },
  acceptButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptIcon: {
    fontSize: 28,
    color: '#fff',
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  mysteryIcon: {
    fontSize: 80,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  expiredIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  heartIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
