import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useAppStore } from '../store/AppStore';
import { askAI } from '../services/AIService';

export default function ChatScreen() {
  const theme = useTheme();
  const { messages, addMessage, isPremium, dailyChatCount } = useAppStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const canChat = isPremium || dailyChatCount < 20;

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
  }, [messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!canChat) {
      Alert.alert('💬 今日次数用完', '明天再来吧～或者开通高级会员，无限对话！', [
        { text: '知道了', style: 'cancel' },
        { text: '开通会员', onPress: () => {} },
      ]);
      return;
    }

    setInput('');
    addMessage({ role: 'user', content: text });
    setLoading(true);

    try {
      const reply = await askAI(text, messages);
      addMessage({ role: 'assistant', content: reply });
    } catch (err: any) {
      addMessage({ role: 'assistant', content: '抱歉，出了点问题～请稍后再试试。或者加客服微信 z6ys8866 告诉我发生了什么呀。' });
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const aiTyping = loading && messages.length > 0 && messages[messages.length - 1].role === 'user';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* 顶部标题栏 */}
      <View style={[styles.header, { backgroundColor: theme.colors.white, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>💗 为你好 · 倾听陪伴</Text>
        {!isPremium && (
          <Text style={[styles.remainText, { color: theme.colors.textSecondary }]}>
            今日剩余 {Math.max(0, 20 - dailyChatCount)} 次
          </Text>
        )}
      </View>

      {/* 欢迎语（空消息时显示） */}
      {messages.length === 0 && (
        <View style={styles.welcomeWrap}>
          <Text style={styles.welcomeEmoji}>🌸</Text>
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>你好呀，我在这里</Text>
          <Text style={[styles.welcomeDesc, { color: theme.colors.textSecondary }]}>
            想说点什么都可以～{'\n'}我会认真听你说的每一句话
          </Text>
          <View style={styles.quickBtns}>
            {['最近有点难过', '心里很烦躁', '睡不着', '有点迷茫'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.quickBtn, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}
                onPress={() => { setInput(t); }}
              >
                <Text style={[styles.quickBtnText, { color: theme.colors.textSecondary }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 消息列表 */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.role === 'user' ? styles.userRow : styles.aiRow,
            ]}
          >
            {msg.role === 'assistant' && (
              <View style={[styles.aiAvatar, { backgroundColor: '#FFE4EC' }]}>
                <Text style={styles.aiAvatarText}>💗</Text>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                msg.role === 'user'
                  ? [styles.userBubble, { backgroundColor: theme.colors.primary }]
                  : [styles.aiBubble, { backgroundColor: theme.colors.white, borderColor: theme.colors.border }],
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: msg.role === 'user' ? '#fff' : theme.colors.text },
                ]}
              >
                {msg.content}
              </Text>
            </View>
            {msg.role === 'user' && (
              <View style={[styles.userAvatar, { backgroundColor: theme.colors.primaryDark }]}>
                <Text style={styles.userAvatarText}>👤</Text>
              </View>
            )}
          </View>
        ))}

        {/* AI正在输入 */}
        {aiTyping && (
          <View style={[styles.messageRow, styles.aiRow]}>
            <View style={[styles.aiAvatar, { backgroundColor: '#FFE4EC' }]}>
              <Text style={styles.aiAvatarText}>💗</Text>
            </View>
            <View style={[styles.bubble, styles.aiBubble, { backgroundColor: theme.colors.white, borderColor: theme.colors.border }]}>
              <View style={styles.typingRow}>
                <Text style={styles.dotAnim}>●</Text>
                <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>小暖正在倾听...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 输入区 */}
      <View style={[styles.inputWrap, { backgroundColor: theme.colors.white, borderTopColor: theme.colors.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text }]}
          placeholder="说点什么吧..."
          placeholderTextColor={theme.colors.textLight}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: input.trim() ? theme.colors.primary : theme.colors.border },
            theme.shadows.button,
          ]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  remainText: { fontSize: 12, textAlign: 'center', marginTop: 4 },
  welcomeWrap: { alignItems: 'center', padding: 30 },
  welcomeEmoji: { fontSize: 56, marginBottom: 16 },
  welcomeTitle: { fontSize: 22, fontWeight: '800', marginBottom: 10 },
  welcomeDesc: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  quickBtns: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  quickBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 9999, borderWidth: 1 },
  quickBtnText: { fontSize: 13 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  aiAvatarText: { fontSize: 16 },
  userAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  userAvatarText: { fontSize: 14, color: '#fff' },
  bubble: { maxWidth: '75%', padding: 14, borderRadius: 20 },
  userBubble: { borderBottomRightRadius: 6 },
  aiBubble: { borderWidth: 1, borderBottomLeftRadius: 6 },
  messageText: { fontSize: 15, lineHeight: 24 },
  typingRow: { flexDirection: 'row', alignItems: 'center' },
  dotAnim: { fontSize: 12, color: '#FF8FAB', marginRight: 6 },
  typingText: { fontSize: 13 },
  inputWrap: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, paddingBottom: 24, borderTopWidth: 1, gap: 10 },
  input: { flex: 1, minHeight: 44, maxHeight: 100, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 10, fontSize: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { fontSize: 20, color: '#fff' },
});
