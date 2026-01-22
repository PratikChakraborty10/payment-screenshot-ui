import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Image, ImageSourcePropType, Modal, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';

// Bank logo imports
const bankLogos: Record<string, ImageSourcePropType> = {
  sbi: require('../assets/images/SBI-logo.png'),
  hdfc: require('../assets/images/hdfc-logo.png'),
  icici: require('../assets/images/icici-bank-logo.png'),
  axis: require('../assets/images/axis-bank-logo.png'),
  default: require('../assets/images/upi-logo.png'),
};

const getBankLogo = (bankName: string): ImageSourcePropType => {
  const name = bankName.toLowerCase();
  if (name.includes('state bank') || name.includes('sbi')) return bankLogos.sbi;
  if (name.includes('hdfc')) return bankLogos.hdfc;
  if (name.includes('icici')) return bankLogos.icici;
  if (name.includes('axis')) return bankLogos.axis;
  return bankLogos.default;
};

// Avatar colors like Google
const avatarColors = [
  '#EA4335', // Red
  '#FBBC04', // Yellow
  '#34A853', // Green
  '#4285F4', // Blue
  '#FF6D01', // Orange
  '#46BDC6', // Teal
  '#7B1FA2', // Purple
  '#E91E63', // Pink
];

const getFirstLetter = (name: string): string => {
  // Remove leading numbers and spaces, then get first letter
  const cleaned = name.replace(/^[0-9\s]+/, '');
  return cleaned.charAt(0).toUpperCase() || 'U';
};

const getAvatarColor = (name: string): string => {
  // Generate consistent color based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export default function Screenshot() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    recipientName: string;
    amount: string;
    dateTime: string;
    bankName: string;
    bankAccountLast4: string;
    upiTransactionId: string;
    toName: string;
    toBankLast4: string;
    toUpiId: string;
    toApp: string;
    fromName: string;
    fromBank: string;
    fromEmail: string;
    fromApp: string;
    googleTransactionId: string;
  }>();

  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setHasScrolled(offsetY > 10);
  };

  const handleDownload = async () => {
    setMenuVisible(false);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save screenshots');
        return;
      }
      
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Success', 'Screenshot saved to gallery!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save screenshot');
    }
  };

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Fixed Header */}
      <View 
        className="flex-row justify-between items-center px-4 pb-3 bg-[#121212]"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <View className='flex flex-row gap-4 items-center'>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View 
            className="absolute right-4 bg-[#2D2D2D] rounded-lg overflow-hidden min-w-[150px]"
            style={{ top: insets.top + 50 }}
          >
            <TouchableOpacity 
              className="flex-row items-center p-3.5"
              onPress={handleDownload}
            >
              <Ionicons name="download-outline" size={20} color="#FFFFFF" style={{ marginRight: 12 }} />
              <Text className="text-white text-sm">Download</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={{ flex: 1 }}>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Avatar Section */}
        <View className="items-center mt-4">
          <View 
            className="w-[52px] h-[52px] rounded-full items-center justify-center"
            style={{ backgroundColor: getAvatarColor(params.recipientName || '') }}
          >
            <Text className="text-white text-2xl font-medium">
              {params.recipientName ? getFirstLetter(params.recipientName) : ''}
            </Text>
          </View>
          <Text className="text-white text-sm mt-2.5 font-medium">
            {params.recipientName || ''}
          </Text>
        </View>

        {/* Amount */}
        <View className="flex-row items-center justify-center mt-6">
          <Text className="text-white text-[32px] font-light">₹</Text>
          <Text className="text-white text-5xl font-medium">{params.amount || ''}</Text>
        </View>

        {/* Transferred Status */}
        <View className="flex-row items-center justify-center mt-3.5">
          <View className="w-4 h-4 rounded-full bg-[#2e974a] items-center justify-center mr-1.5">
            <Ionicons name="checkmark" size={12} color="#000" />
          </View>
          <Text className="text-white text-sm font-normal">Completed</Text>
        </View>

        <View className='w-[60%] mx-auto mt-4 h-[0.8px] bg-[#9AA0A6]'></View>

        {/* Date Time */}
        <Text className="text-[#9AA0A6] text-[13px] text-center mt-[18px]">
          {params.dateTime || ''}
        </Text>

        {/* Transaction Details Card - Transparent with slight white overlay */}
        <View className="mx-4 mt-6 border-2 border-white/10 bg-transparent rounded-2xl overflow-hidden">
          {/* Bank Header Row */}
          <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-white/10">
            <View className="flex-row items-center flex-1">
              <View className="w-[50px] h-[30px] rounded-lg bg-white items-center justify-center mr-3 overflow-hidden">
                <Image 
                  source={getBankLogo(params.bankName || '')}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-white text-sm font-medium">
                {params.bankName || ''} ••••{params.bankAccountLast4 || ''}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
          </View>

          {/* Transaction Details Content */}
          <View className="px-4 py-4">
            {/* UPI Transaction ID */}
            <View className="mb-[18px]">
              <Text className="text-white text-sm font-normal mb-[3px]">
                UPI transaction ID
              </Text>
              <Text className="text-[#9AA0A6] text-sm font-normal">
                {params.upiTransactionId || ''}
              </Text>
            </View>

            {/* To */}
            <View className="mb-[18px]">
              <Text className="text-white text-sm font-normal mb-[3px]">
                To: {params.toName || ''}
              </Text>
              <Text className="text-[#9AA0A6] text-sm font-normal">
                {params.toApp || ''}{params.toApp && params.toUpiId ? ' • ' : ''}{params.toUpiId || ''}
              </Text>
            </View>

            {/* From */}
            <View className="mb-[18px]">
              <Text className="text-white text-sm font-normal mb-[3px]">
                From: {params.fromName ? `${params.fromName}${params.fromBank ? ` (${params.fromBank})` : ''}` : (params.fromBank || '')}
              </Text>
              <Text className="text-[#9AA0A6] text-sm font-normal">
                {params.fromApp || ''}{params.fromApp && params.fromEmail ? ' • ' : ''}{params.fromEmail || ''}
              </Text>
            </View>

            {/* Google Transaction ID */}
            <View>
              <Text className="text-white text-sm font-normal mb-[3px]">
                Google transaction ID
              </Text>
              <Text className="text-[#9AA0A6] text-sm font-normal">
                {params.googleTransactionId || ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Payments disclaimer */}
        <Text className="text-[#9AA0A6] text-xs text-center mt-6 mx-10 leading-[18px]">
          Payments may take up to 3 working days to be reflected in your account
        </Text>

        {/* UPI Logo */}
        <View className="items-center mt-4">
          <Text className="text-white text-[6px] tracking-wide mb-[3px]">
            POWERED BY
          </Text>
          <Image 
            source={require('../assets/images/upi-logo.png')} 
            className="w-[50px] h-5 opacity-60"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
      </ViewShot>

      {/* Fixed Bottom - Having Issues Button - Only show when scrolled */}
      {hasScrolled && (
      <View 
        className="absolute bottom-0 left-0 right-0 px-4 pt-4 rounded-b-2xl bg-[#1A1A1A]"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <TouchableOpacity className="flex-row items-center bg-[#2D2D2D] py-3 px-4 rounded-3xl self-start">
          <Ionicons name="help-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text className="text-white text-sm font-normal">Having issues?</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
}
