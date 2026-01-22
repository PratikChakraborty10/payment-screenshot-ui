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
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Fixed Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        backgroundColor: '#121212',
      }}>
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
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={{ 
            position: 'absolute', 
            top: insets.top + 50, 
            right: 16, 
            backgroundColor: '#2D2D2D', 
            borderRadius: 8,
            overflow: 'hidden',
            minWidth: 150
          }}>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}
              onPress={handleDownload}
            >
              <Ionicons name="download-outline" size={20} color="#FFFFFF" style={{ marginRight: 12 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Download</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={{ flex: 1 }}>

      {/* Scrollable Content */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Avatar Section */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <View style={{ 
            width: 52, 
            height: 52, 
            borderRadius: 26, 
            backgroundColor: getAvatarColor(params.recipientName || ''),
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '500' }}>
              {params.recipientName ? getFirstLetter(params.recipientName) : ''}
            </Text>
          </View>
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: 14,
            marginTop: 10,
            fontWeight: '500',
          }}>
            {params.recipientName || ''}
          </Text>
        </View>

        {/* Amount */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '300' }}>₹</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 48, fontWeight: '500' }}>{params.amount || ''}</Text>
        </View>

        {/* Transferred Status */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginTop: 14 
        }}>
          <View style={{ 
            width: 16, 
            height: 16, 
            borderRadius: 9, 
            backgroundColor: '#2e974aff', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: 6 
          }}>
            <Ionicons name="checkmark" size={12} color="#000" />
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '400' }}>Completed</Text>
        </View>

        <View className='w-[60%] mx-auto mt-4 h-[0.8px] bg-[#9AA0A6]'></View>

        {/* Date Time */}
        <Text style={{ 
          color: '#9AA0A6', 
          fontSize: 13, 
          textAlign: 'center', 
          marginTop: 18,
        }}>
          {params.dateTime || ''}
        </Text>

        {/* Transaction Details Card - Transparent with slight white overlay */}
        <View style={{ 
          marginHorizontal: 16, 
          marginTop: 24, 
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          borderRadius: 16,
          overflow: 'hidden'
        }}>
          {/* Bank Header Row */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingHorizontal: 16, 
            paddingVertical: 14,
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ 
                width: 50, 
                height: 30, 
                borderRadius: 8, 
                backgroundColor: '#FFFFFF', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: 12,
                overflow: 'hidden'
              }}>
                <Image 
                  source={getBankLogo(params.bankName || '')}
                  style={{ width: 28, height: 28 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ 
                color: '#FFFFFF', 
                fontSize: 14, 
                fontWeight: '500'
              }}>
                {params.bankName || ''} ••••{params.bankAccountLast4 || ''}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
          </View>

          {/* Transaction Details Content */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            {/* UPI Transaction ID */}
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '400', marginBottom: 3 }}>
                UPI transaction ID
              </Text>
              <Text style={{ color: '#9AA0A6', fontSize: 14, fontWeight: '400' }}>
                {params.upiTransactionId || ''}
              </Text>
            </View>

            {/* To */}
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '400', marginBottom: 3 }}>
                To: {params.toName || ''}
              </Text>
              <Text style={{ color: '#9AA0A6', fontSize: 14, fontWeight: '400' }}>
                {params.toApp || ''}{params.toApp && params.toUpiId ? ' • ' : ''}{params.toUpiId || ''}
              </Text>
            </View>

            {/* From */}
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '400', marginBottom: 3 }}>
                From: {params.fromName ? `${params.fromName}${params.fromBank ? ` (${params.fromBank})` : ''}` : (params.fromBank || '')}
              </Text>
              <Text style={{ color: '#9AA0A6', fontSize: 14, fontWeight: '400' }}>
                {params.fromApp || ''}{params.fromApp && params.fromEmail ? ' • ' : ''}{params.fromEmail || ''}
              </Text>
            </View>

            {/* Google Transaction ID */}
            <View>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '400', marginBottom: 3 }}>
                Google transaction ID
              </Text>
              <Text style={{ color: '#9AA0A6', fontSize: 14, fontWeight: '400' }}>
                {params.googleTransactionId || ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Payments disclaimer */}
        <Text style={{ 
          color: '#9AA0A6', 
          fontSize: 12, 
          textAlign: 'center', 
          marginTop: 24,
          marginHorizontal: 40,
          lineHeight: 18,
        }}>
          Payments may take up to 3 working days to be reflected in your account
        </Text>

        {/* UPI Logo */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 6, letterSpacing: 0.2, marginBottom: 3 }}>
            POWERED BY
          </Text>
          <Image 
            source={require('../assets/images/upi-logo.png')} 
            style={{ 
              width: 50, 
              height: 20, 
              opacity: 0.6,
            }}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
      </ViewShot>

      {/* Fixed Bottom - Having Issues Button - Only show when scrolled */}
      {hasScrolled && (
      <View style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16, 
        paddingTop: 16,
        borderEndStartRadius: 16,
        borderEndEndRadius: 16,
        paddingBottom: insets.bottom + 16,
        backgroundColor: '#1A1A1A',
      }}>
        <TouchableOpacity style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#2D2D2D',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 24,
          alignSelf: 'flex-start'
        }}>
          <Ionicons name="help-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '400' }}>Having issues?</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
}
