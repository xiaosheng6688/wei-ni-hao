import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useAppStore } from '../store/AppStore';

const WELCOME_MESSAGES = [
  '不管外面世界怎么变，我永远在这里等你。',
  '今天想说点什么吗？我在听。',
  '有些话无人可说的时候，我在这里。',
  '你来了呀，我等你好久了～',
];

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const { isPremium, dailyChatCount } = useAppStore();
  const welcome = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 顶部欢迎区 */}
        <LinearGradient
          colors={['#FF8FAB', '#FFB6C8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.logo}>💗</Text>
          <Text style={styles.title}>为你好</Text>
          <Text style={styles.subtitle}>{welcome}</Text>
          {!isPremium && (
            <TouchableOpacity
              style={styles.premiumBadge}
              onPress={() => navigation.navigate('Profile')}
            >
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.badgeInner}>
                <Text style={styles.badgeText}>🌟 开通高级会员 · ¥9.9/月</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* 功能卡片区 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>温暖功能</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Chat')}
            style={styles.cardWrapper}
          >
            <LinearGradient
              colors={['#FFE4EC', '#FFF0F5']}
              style={[styles.mainCard, theme.shadows.card]}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmoji}>💬</Text>
                <View>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>倾诉倾听</Text>
                  <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>
                    {isPremium ? '✨ 无限次对话' : `今日剩余 ${Math.max(0, 20 - dailyChatCount)} 次`}
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.grid}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Sound')}
              style={styles.gridCard}
            >
              <LinearGradient colors={['#E8F5FF', '#F0F8FF']} style={[styles.smallCard, theme.shadows.card]}>
                <Text style={styles.gridEmoji}>🎵</Text>
                <Text style={[styles.gridTitle, { color: theme.colors.text }]}>治愈声音</Text>
                <Text style={[styles.gridDesc, { color: theme.colors.textSecondary }]}>4种自然声</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Profile')}
              style={styles.gridCard}
            >
              <LinearGradient colors={['#FFF8E1', '#FFFDE7']} style={[styles.smallCard, theme.shadows.card]}>
                <Text style={styles.gridEmoji}>💎</Text>
                <Text style={[styles.gridTitle, { color: theme.colors.text }]}>高级会员</Text>
                <Text style={[styles.gridDesc, { color: theme.colors.textSecondary }]}>解锁全部功能</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* 每日一句 */}
        <View style={[styles.quoteCard, { backgroundColor: '#FFF0F5', ...theme.shadows.card }]}>
          <Text style={styles.quoteIcon}>🌸</Text>
          <Text style={[styles.quoteText, { color: theme.colors.text }]}>
            "你不需要每天都很有力量，有些日子只需要撑过去就好。"
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 30 },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, alignItems: 'center' },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.95)', textAlign: 'center', paddingHorizontal: 20, lineHeight: 24 },
  premiumBadge: { marginTop: 16, borderRadius: 9999, overflow: 'hidden' },
  badgeInner: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 9999 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  section: { padding: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  cardWrapper: { marginBottom: 14, borderRadius: 20, overflow: 'hidden' },
  mainCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 20 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  cardEmoji: { fontSize: 40, marginRight: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 13 },
  arrow: { fontSize: 28, color: '#FF8FAB', fontWeight: '300' },
  grid: { flexDirection: 'row', gap: 12 },
  gridCard: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  smallCard: { padding: 18, alignItems: 'center', borderRadius: 16 },
  gridEmoji: { fontSize: 32, marginBottom: 8 },
  gridTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  gridDesc: { fontSize: 12 },
  quoteCard: { marginHorizontal: 20, marginTop: 10, padding: 20, borderRadius: 20, alignItems: 'center' },
  quoteIcon: { fontSize: 28, marginBottom: 10 },
  quoteText: { fontSize: 15, textAlign: 'center', lineHeight: 26, fontStyle: 'italic' },
});
