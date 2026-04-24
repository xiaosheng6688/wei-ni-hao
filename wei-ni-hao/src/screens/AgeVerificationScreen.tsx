import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useAppStore } from '../store/AppStore';

export default function AgeVerificationScreen() {
  const theme = useTheme();
  const setAgeVerified = useAppStore((s) => s.setAgeVerified);
  const [selected, setSelected] = useState('');

  const handleConfirm = () => {
    if (!selected) return;
    if (selected === 'yes') {
      setAgeVerified(true);
    } else {
      alert('抱歉，本产品仅对18岁及以上用户开放。感谢你的理解～');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 顶部装饰 */}
      <View style={styles.topArea}>
        <Text style={styles.logo}>💗</Text>
        <Text style={styles.title}>为你好</Text>
        <Text style={styles.subtitle}>一个温暖你、陪伴你的地方</Text>
      </View>

      {/* 插画 */}
      <Text style={styles.illustration}>🌸 🌷 🌻 🌺</Text>

      {/* 年龄确认 */}
      <View style={[styles.card, { backgroundColor: theme.colors.white }, theme.shadows.card]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>温馨提示</Text>
        <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>
          为你好是一款情感陪伴应用，为成年人提供温暖倾听服务。
        </Text>
        <Text style={[styles.cardQuestion, { color: theme.colors.text }]}>
          你是否年满18周岁？
        </Text>

        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.option,
              { borderColor: selected === 'yes' ? theme.colors.primary : theme.colors.border },
              selected === 'yes' && { backgroundColor: '#FFE4EC' },
            ]}
            onPress={() => setSelected('yes')}
          >
            <Text style={styles.optionEmoji}>✅</Text>
            <Text style={[styles.optionText, { color: theme.colors.text }]}>是的，我已满18岁</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              { borderColor: selected === 'no' ? theme.colors.primary : theme.colors.border },
              selected === 'no' && { backgroundColor: '#FFE4EC' },
            ]}
            onPress={() => setSelected('no')}
          >
            <Text style={styles.optionEmoji}>❌</Text>
            <Text style={[styles.optionText, { color: theme.colors.text }]}>我还未满18岁</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmBtn,
            { backgroundColor: selected ? theme.colors.primary : theme.colors.border },
            theme.shadows.button,
          ]}
          onPress={handleConfirm}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnText}>确认进入</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footNote}>
        使用本产品即表示同意《用户协议》{'\n'}
        本产品不替代专业心理咨询
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  topArea: { alignItems: 'center', marginBottom: 20 },
  logo: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '800', color: '#FF8FAB', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#8B7355' },
  illustration: { fontSize: 32, marginBottom: 24, letterSpacing: 8 },
  card: { width: '100%', borderRadius: 24, padding: 28 },
  cardTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  cardText: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  cardQuestion: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  options: { gap: 12, marginBottom: 24 },
  option: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 2 },
  optionEmoji: { fontSize: 24, marginRight: 12 },
  optionText: { fontSize: 15, fontWeight: '600' },
  confirmBtn: { borderRadius: 9999, paddingVertical: 16, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  footNote: { textAlign: 'center', color: '#B8A090', fontSize: 11, marginTop: 24, lineHeight: 18 },
});
