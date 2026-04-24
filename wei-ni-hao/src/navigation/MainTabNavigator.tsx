import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import SoundScreen from '../screens/SoundScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  Chat: '💬',
  Sound: '🎵',
  Profile: '👤',
};

const TAB_LABELS: Record<string, string> = {
  Home: '首页',
  Chat: '倾听',
  Sound: '声音',
  Profile: '我的',
};

export default function MainTabNavigator() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.colors.tabBarBg,
              borderTopColor: theme.colors.tabBarBorder,
              borderTopWidth: 1,
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
              paddingTop: 8,
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textLight,
            tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
          }}
        >
          {(['Home', 'Chat', 'Sound', 'Profile'] as const).map((name) => (
            <Tab.Screen
              key={name}
              name={name}
              component={name === 'Home' ? HomeScreen : name === 'Chat' ? ChatScreen : name === 'Sound' ? SoundScreen : ProfileScreen}
              options={{
                tabBarLabel: TAB_LABELS[name],
                tabBarIcon: ({ focused }) => (
                  <Text style={{ fontSize: focused ? 24 : 22, opacity: focused ? 1 : 0.6 }}>
                    {TAB_ICONS[name]}
                  </Text>
                ),
              }}
            />
          ))}
        </Tab.Navigator>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
