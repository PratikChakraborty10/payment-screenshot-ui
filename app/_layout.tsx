import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import SplashScreen from '../components/SplashScreen';
import "../global.css";
import { supabase } from '../lib/supabase';

import { syncUserWithBackend } from '../lib/api';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthInitialized(true);
      if (session) {
         syncUserWithBackend(session);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        syncUserWithBackend(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthInitialized || showSplash) return;

    const inAuthGroup = (segments[0] as string) === 'auth';
    
    if (session && inAuthGroup) {
        // Redirect to home if logged in and trying to access auth screens
        router.replace('/'); 
    } else if (!session && !inAuthGroup) {
        // Redirect to login if not logged in
        // router.replace('/auth'); // Commented out for now to avoid specific redirect loops until verified
       // Actually, let's strictly enforce it:
       router.replace('/auth' as any);
    }
  }, [session, segments, isAuthInitialized, showSplash]);

  // Handle deep linking for OAuth
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
        console.log('🔹 Deep link received:', event.url);
        try {
            const parsed = Linking.parse(event.url);
            console.log('🔹 Parsed link:', JSON.stringify(parsed, null, 2));
            const { queryParams } = parsed;
            
            if (queryParams?.code) {
                console.log('🔹 Found code, exchanging for session...');
                // PKCE Flow: Exchange code for session
                const { data, error } = await supabase.auth.exchangeCodeForSession(queryParams.code as string);
                if (error) {
                    console.error('🔴 Exchange error:', error);
                    throw error;
                }
                console.log('✅ Session exchanged successfully:', data.session?.user?.email);
            } else if (queryParams?.access_token && queryParams?.refresh_token) {
                console.log('🔹 Found tokens, setting session directly...');
                // Implicit Flow: Set session directly
                const { error } = await supabase.auth.setSession({
                    access_token: queryParams.access_token as string,
                    refresh_token: queryParams.refresh_token as string,
                });
                if (error) {
                    console.error('🔴 SetSession error:', error);
                    throw error;
                }
                console.log('✅ Session set successfully');
            } else {
                console.log('🔸 No code or tokens found in URL');
            }
        } catch (error) {
            console.error('🔴 Deep link auth error:', error);
        }
    };
    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
  }, []);


  if (showSplash) {
    return (
      <>
        <SplashScreen onFinish={() => setShowSplash(false)} />
        <StatusBar style="light" />
      </>
    );
  }

  if (!isAuthInitialized) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
              <ActivityIndicator size="large" color="#fff" />
          </View>
      )
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
