import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-url-polyfill/auto';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession(); // Required for WebBrowser to work correctly

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const redirectUrl = Linking.createURL('/auth/callback');

      console.log('Redirecting to:', redirectUrl); // Log for debugging

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        alert(error.message);
      } else if (data?.url) {
        // Open the URL to start the OAuth flow
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
            console.log('🔹 Browser Result URL:', result.url);

            // Extract the hash part of the URL manually because Linking.parse might not handle the hash parameters correctly for this format
            const url = new URL(result.url);
            const hash = url.hash.substring(1); // Remove the leading '#'
            const params = new URLSearchParams(hash);

            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');

            if (access_token && refresh_token) {
                console.log('🔹 Found tokens in hash, setting session...');
                const { error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });
                if (error) {
                     console.error('Session error:', error);
                     alert(error.message);
                } else {
                    console.log('✅ Session set successfully!');
                }
            } else {
                // Fallback to checking query params if hash is empty (for PKCE in future)
                const { queryParams } = Linking.parse(result.url);
                 if (queryParams?.code) {
                    console.log('🔹 Browser returned code, exchanging...');
                    const { error } = await supabase.auth.exchangeCodeForSession(queryParams.code as string);
                    if (error) {
                        console.error('Exchange error:', error);
                        alert(error.message);
                    } else {
                        console.log('✅ Session exchanged!');
                    }
                } else {
                     console.log('🔸 No tokens or code found in browser result');
                }
            }
        }
      }
    } catch (err) {
      console.error('Sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 px-6">
      <View className="w-full max-w-sm items-center gap-6">
        <View className="items-center">
            <Text className="text-3xl font-bold text-white">Welcome Back</Text>
            <Text className="text-gray-400 mt-2 text-center">Sign in to continue to your dashboard</Text>
        </View>

        <TouchableOpacity
          onPress={signInWithGoogle}
          disabled={loading}
          className="flex-row items-center justify-center bg-white w-full py-4 rounded-xl active:bg-gray-100"
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <>
              {/* Google G Logo Placeholder */}
               <Text className="font-semibold text-lg text-black">Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
