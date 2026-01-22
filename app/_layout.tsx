import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import SplashScreen from '../components/SplashScreen';
import "../global.css";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <>
        <SplashScreen onFinish={() => setShowSplash(false)} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </>
  );
}
