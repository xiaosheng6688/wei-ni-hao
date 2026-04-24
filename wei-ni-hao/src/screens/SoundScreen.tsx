import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useAppStore } from '../store/AppStore';
import { playSound, stopSound, setVolume, SoundType } from '../services/SoundService';

const SOUNDS: { id: SoundType; name: string; desc: string; emoji: string; gradient: string[] }[] = [
  { id: 'rain', name: '细雨', desc: '温柔的雨声，抚平思绪', emoji: '🌧️', gradient: ['#B8D4E8', '#D4E8F5'] },
  { id: 'ocean', name: '海浪', desc: '潮起潮落的海风', emoji: '🌊', gradient: ['#A8D8EA', '#C8E8F5'] },
  { id: 'forest', name: '森林', desc: '鸟鸣与树叶的沙沙声', emoji: '🌲', gradient: ['#B8E0C8', '#D0ECD8'] },
  { id: 'cafe', name: '咖啡馆', desc: '舒适的背景白噪音', emoji: '☕', gradient: ['#E8D8C8', '#F5EDE0'] },
];

export default function SoundScreen() {
  const theme = useTheme();
  const { currentSound, setCurrentSound, soundEnabled, toggleSound } = useAppStore();
  const [playing, setPlaying] = useState(false);

  const handleToggle = async (sound: SoundType) => {
    if (currentSound === sound && playing) {
      await stopSound();
      setPlaying(false);
      setCurrentSound(null);
    } else {
      await playSound(sound);
      setPlaying(true);
      setCurrentSound(sound);
    }
  };

  const handleVolume = async (vol: number) => {
    await setVolume(vol);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 顶部 */}
      <View style={[styles.header, { backgroundColor: theme.colors.white, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>🎵 治愈声音</Text>
        <TouchableOpacity onPress={toggleSound} style={styles.muteBtn}>
          <Text style={styles.muteBtnText}>{soundEnabled ? '🔊' : '🔇'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          点击任意卡片，开启治愈之旅 ✨
        </Text>

        {SOUNDS.map((s) => (
          <TouchableOpacity
            key={s.id}
            activeOpacity={0.85}
            onPress={() => handleToggle(s.id)}
            style={styles.cardWrapper}
          >
            <LinearGradient
              colors={s.gradient as any}
              style={[
                styles.soundCard,
                theme.shadows.card,
                currentSound === s.id && playing ? styles.activeCard : {},
              ]}
            >
              <View style={styles.cardTop}>
                <Text style={styles.soundEmoji}>{s.emoji}</Text>
                {currentSound === s.id && playing && (
                  <View style={styles.playingBadge}>
                    <Text style={styles.playingBadgeText}>▶ 播放中</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.soundName, { color: theme.colors.text }]}>{s.name}</Text>
              <Text style={[styles.soundDesc, { color: theme.colors.textSecondary }]}>{s.desc}</Text>
              {currentSound === s.id && playing && (
                <View style={styles.volumeBar}>
                  {[0.3, 0.6, 1.0].map((vol) => (
                    <TouchableOpacity
                      key={vol}
                      style={[styles.volDot, { opacity: vol === 1.0 ? 1 : 0.5 }]}
                      onPress={(e) => { e.stopPropagation(); handleVolume(vol); }}
                    >
                      <Text style={styles.volDotText}>{vol === 1.0 ? '🔊' : '🔈'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <View style={[styles.tipCard, { backgroundColor: '#FFF0F5' }]}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
            建议：开启声音后，配合倾诉聊天，效果更佳哦～
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  muteBtn: { position: 'absolute', right: 20, padding: 4 },
  muteBtnText: { fontSize: 24 },
  content: { padding: 20, paddingBottom: 40 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  cardWrapper: { marginBottom: 16, borderRadius: 24, overflow: 'hidden' },
  soundCard: { padding: 24, borderRadius: 24 },
  activeCard: { transform: [{ scale: 1.02 }] },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  soundEmoji: { fontSize: 48 },
  playingBadge: { backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 },
  playingBadgeText: { fontSize: 12, color: '#FF8FAB', fontWeight: '600' },
  soundName: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  soundDesc: { fontSize: 13 },
  volumeBar: { flexDirection: 'row', gap: 12, marginTop: 14 },
  volDot: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.6)' },
  volDotText: { fontSize: 16 },
  tipCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginTop: 10 },
  tipIcon: { fontSize: 24, marginRight: 12 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 22 },
});
