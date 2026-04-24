import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>💗</Text>
      <Text style={styles.title}>为你好</Text>
      <Text style={styles.subtitle}>正在加载温暖...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#FF8FAB', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#B8A090' },
});
