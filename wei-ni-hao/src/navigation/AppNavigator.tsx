import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store/AppStore';
import AgeVerificationScreen from '../screens/AgeVerificationScreen';
import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  AgeVerification: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isAgeVerified = useAppStore((s) => s.isAgeVerified);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isAgeVerified ? (
        <Stack.Screen name="AgeVerification" component={AgeVerificationScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
