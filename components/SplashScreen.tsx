import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [textOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Text fade in after logo
    setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Fade out and finish after 4 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-[#121212] items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <View className="w-24 h-24 rounded-3xl bg-[#1A73E8] items-center justify-center mb-6 shadow-lg">
          <Ionicons name="card" size={48} color="#FFFFFF" />
        </View>

        {/* App Name */}
        <Animated.View style={{ opacity: textOpacity }}>
          <Text className="text-white text-3xl font-bold mb-2">
            GPay Generator
          </Text>
          <Text className="text-[#9AA0A6] text-center text-sm">
            Create realistic payment screenshots
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom text */}
      <Animated.View 
        style={{ 
          position: 'absolute', 
          bottom: 60,
          opacity: textOpacity 
        }}
      >
      </Animated.View>
    </View>
  );
}
