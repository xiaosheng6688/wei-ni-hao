import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useAppStore } from '../store/AppStore';

// Web静态资源路径（Expo export会把assets/目录下的文件放到dist/assets/）
const QR_WECHAT = '/assets/qr/wechat.jpg';
const QR_ALIPAY = '/assets/qr/alipay.jpg';

export default function PremiumScreen({ navigation }: any) {
  const theme = useTheme();
  const { isPremium, setPremium } = useAppStore();
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePaid = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPremium(true, Date.now() + 30 * 24 * 60 * 60 * 1000);
      setShowQR(false);
      Alert.alert('🎉 开通成功', '感谢你的支持！高级会员已开通～', [
        { text: '太棒了', onPress: () => navigation.goBack() },
      ]);
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>开通高级会员</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroEmoji}>💎</Text>
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>高级会员</Text>
        <Text style={[styles.heroSub, { color: theme.colors.textSecondary }]}>
          一杯奶茶的钱，换无限温暖陪伴
        </Text>

        <LinearGradient colors={['#FFE4EC', '#FFF0F5']} style={styles.priceCard}>
          <Text style={styles.price}>¥9.9</Text>
          <Text style={styles.priceUnit}>/月 · 随时取消</Text>
        </LinearGradient>

        <View style={styles.benefits}>
          {[
            { icon: '💬', text: '无限次倾诉对话', desc: '想说多少就说多少' },
            { icon: '🎵', text: '四种治愈声音', desc: '雨声·海浪·森林·咖啡馆' },
            { icon: '☁️', text: '对话历史永久保存', desc: '随时回顾温暖时刻' },
            { icon: '🌟', text: '优先响应', desc: '更快获得回复' },
          ].map((b, i) => (
            <View key={i} style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>{b.icon}</Text>
              <View>
                <Text style={[styles.benefitText, { color: theme.colors.text }]}>{b.text}</Text>
                <Text style={[styles.benefitDesc, { color: theme.colors.textSecondary }]}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.85} onPress={() => setShowQR(true)} disabled={isPremium}>
          <LinearGradient
            colors={isPremium ? ['#CCC', '#AAA'] : ['#FF8FAB', '#FF6B8A']}
            style={[styles.buyBtn, theme.shadows.button]}
          >
            <Text style={styles.buyBtnText}>
              {isPremium ? '✅ 已开通会员' : '💳 立即开通 · ¥9.9/月'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.serviceBtn}
          onPress={() => Alert.alert('📱 联系客服', '微信：z6ys8866\n\n长按复制微信号～', [
            { text: '好的' },
          ])}
        >
          <Text style={styles.serviceBtnText}>📱 联系客服 · 微信：z6ys8866</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          支付即表示同意《用户协议》{'\n'}
          客服工作时间：9:00-21:00
        </Text>
      </ScrollView>

      {/* 收款码弹窗 */}
      <Modal visible={showQR} transparent animationType="fade" onRequestClose={() => setShowQR(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.white }]}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowQR(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
              <Text style={styles.modalTitle}>📱 扫码支付 ¥9.9</Text>

              <Text style={[styles.qrLabel, { color: theme.colors.text }]}>💚 微信支付</Text>
              <View style={[styles.qrImageWrapper, { borderColor: theme.colors.border }]}>
                <Image source={{ uri: QR_WECHAT }} style={styles.qrImage} resizeMode="contain" />
              </View>

              <Text style={[styles.qrLabel, { color: theme.colors.text }]}>💙 支付宝</Text>
              <View style={[styles.qrImageWrapper, { borderColor: theme.colors.border }]}>
                <Image source={{ uri: QR_ALIPAY }} style={styles.qrImage} resizeMode="contain" />
              </View>

              <Text style={[styles.payNote, { color: theme.colors.textSecondary }]}>
                扫码支付 ¥9.9 后，{'\n'}
                发截图给客服{' '}
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>z6ys8866</Text>{'\n'}
                备注"为你好会员"，立即开通
              </Text>

              <TouchableOpacity
                style={[styles.confirmBtn, theme.shadows.button]}
                onPress={handlePaid}
                disabled={loading}
              >
                {loading
                  ? <Text style={styles.confirmBtnText}>⏳ 处理中...</Text>
                  : <Text style={styles.confirmBtnText}>✅ 我已支付</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: '#fff' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 32, color: '#FF8FAB', fontWeight: '300' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  content: { padding: 24, paddingBottom: 60 },
  heroEmoji: { fontSize: 64, textAlign: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  heroSub: { fontSize: 15, textAlign: 'center', marginBottom: 24 },
  priceCard: { borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 24 },
  price: { fontSize: 48, fontWeight: '800', color: '#FF6B8A' },
  priceUnit: { fontSize: 14, color: '#999', marginTop: 4 },
  benefits: { backgroundColor: '#fff', borderRadius: 20, padding: 8, marginBottom: 24 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  benefitIcon: { fontSize: 28, marginRight: 14 },
  benefitText: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  benefitDesc: { fontSize: 12 },
  buyBtn: { borderRadius: 9999, paddingVertical: 18, alignItems: 'center', marginBottom: 20 },
  buyBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  serviceBtn: { backgroundColor: '#E8F5E9', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  serviceBtnText: { color: '#07C160', fontSize: 15, fontWeight: '600' },
  disclaimer: { textAlign: 'center', color: '#B8A090', fontSize: 12, marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalCard: { width: '100%', maxHeight: '92%', borderRadius: 24, padding: 24, backgroundColor: '#fff' },
  modalClose: { position: 'absolute', right: 16, top: 12, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  modalCloseText: { fontSize: 22, color: '#CCC' },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  qrLabel: { fontSize: 16, fontWeight: '700', marginBottom: 10, alignSelf: 'flex-start' },
  qrImageWrapper: { width: '100%', aspectRatio: 1, borderRadius: 16, borderWidth: 2, overflow: 'hidden', marginBottom: 16, backgroundColor: '#FAFAFA' },
  qrImage: { width: '100%', height: '100%' },
  payNote: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  confirmBtn: { backgroundColor: '#FF8FAB', borderRadius: 9999, paddingVertical: 16, paddingHorizontal: 60, alignSelf: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
