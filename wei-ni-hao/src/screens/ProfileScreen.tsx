import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useAppStore } from '../store/AppStore';

export default function ProfileScreen({ navigation }: any) {
  const theme = useTheme();
  const { isPremium, premiumExpiry, clearMessages } = useAppStore();

  const formatDate = (ts: number | null) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleClearChat = () => {
    Alert.alert('🗑️ 确认清空', '要清空所有聊天记录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '清空', style: 'destructive', onPress: () => { clearMessages(); } },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 顶部标题 */}
      <View style={[styles.header, { backgroundColor: theme.colors.white, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>👤 为你好</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 会员卡片 */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Chat')}>
          <LinearGradient
            colors={isPremium ? ['#FFD700', '#FFA500'] : ['#FFE4EC', '#FFF0F5']}
            style={[styles.memberCard, theme.shadows.card]}
          >
            <View style={styles.memberRow}>
              <Text style={styles.memberEmoji}>{isPremium ? '💎' : '🌸'}</Text>
              <View>
                <Text style={[styles.memberTitle, { color: isPremium ? '#fff' : theme.colors.text }]}>
                  {isPremium ? '高级会员' : '普通用户'}
                </Text>
                <Text style={[styles.memberDesc, { color: isPremium ? 'rgba(255,255,255,0.9)' : theme.colors.textSecondary }]}>
                  {isPremium
                    ? `到期时间：${formatDate(premiumExpiry)}`
                    : '开通高级会员，解锁无限对话 + 专属治愈声音'}
                </Text>
              </View>
            </View>
            {!isPremium && (
              <View style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>立即开通 · ¥9.9/月</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* 菜单列表 */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>倾诉聊天</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Sound')}>
            <Text style={styles.menuIcon}>🎵</Text>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>治愈声音</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleClearChat}>
            <Text style={styles.menuIcon}>🗑️</Text>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>清空聊天记录</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert('💬 联系客服', '微信：z6ys8866\n工作时间：9:00-21:00\n\n有任何问题欢迎联系我们！', [
                { text: '复制微信号', onPress: () => {} },
                { text: '好的', style: 'cancel' },
              ]);
            }}
          >
            <Text style={styles.menuIcon}>📞</Text>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>联系客服</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 底部说明 */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textLight }]}>
            为你好 v1.0 · 温暖你的每一天 🌸
          </Text>
          <Text style={[styles.footerNote, { color: theme.colors.textLight }]}>
            本产品仅供情感陪伴，不替代专业心理咨询
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  memberCard: { borderRadius: 24, padding: 24, marginBottom: 20 },
  memberRow: { flexDirection: 'row', alignItems: 'center' },
  memberEmoji: { fontSize: 44, marginRight: 16 },
  memberTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  memberDesc: { fontSize: 13, lineHeight: 20 },
  upgradeBtn: { backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  upgradeBtnText: { color: '#FF8FAB', fontWeight: '700', fontSize: 15 },
  menu: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F5F0F0' },
  menuIcon: { fontSize: 22, marginRight: 14 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '500' },
  menuArrow: { fontSize: 22, color: '#CCC', fontWeight: '300' },
  footer: { alignItems: 'center', marginTop: 30, gap: 8 },
  footerText: { fontSize: 13 },
  footerNote: { fontSize: 11, textAlign: 'center' },
});
