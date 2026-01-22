import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const cleaned = name.replace(/^[0-9\s]+/, '');
  return cleaned.charAt(0).toUpperCase() || 'U';
};

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export interface GooglePayScreenshotUIProps {
  recipientName?: string;
  amount?: string;
  dateTime?: string;
  bankName?: string;
  bankAccountLast4?: string;
  upiTransactionId?: string;
  toName?: string;
  toApp?: string;
  toUpiId?: string;
  fromName?: string;
  fromBank?: string;
  fromApp?: string;
  fromEmail?: string;
  googleTransactionId?: string;
  onScroll?: (offsetY: number) => void;
}

export default function GooglePayScreenshotUI({
  recipientName = '',
  amount = '',
  dateTime = '',
  bankName = '',
  bankAccountLast4 = '',
  upiTransactionId = '',
  toName = '',
  toApp = '',
  toUpiId = '',
  fromName = '',
  fromBank = '',
  fromApp = '',
  fromEmail = '',
  googleTransactionId = '',
  onScroll,
}: GooglePayScreenshotUIProps) {
  const insets = useSafeAreaInsets();
  const [hasScrolled, setHasScrolled] = React.useState(false);

  const handleScroll = (offsetY: number) => {
    setHasScrolled(offsetY > 10);
    onScroll?.(offsetY);
  };

  return (
    <View className="flex-1">
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      onScroll={(event) => handleScroll(event.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
    >
      {/* Avatar Section */}
      <View className="items-center mt-4">
        <View 
          className="w-[52px] h-[52px] rounded-full items-center justify-center"
          style={{ backgroundColor: getAvatarColor(recipientName) }}
        >
          <Text className="text-white text-2xl font-medium">
            {recipientName ? getFirstLetter(recipientName) : ''}
          </Text>
        </View>
        <Text className="text-white text-sm mt-2.5 font-medium">
          {recipientName}
        </Text>
      </View>

      {/* Amount */}
      <View className="flex-row items-center justify-center mt-6">
        <Text className="text-white text-[32px] font-light">₹</Text>
        <Text className="text-white text-5xl font-medium">{amount}</Text>
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
        {dateTime}
      </Text>

      {/* Transaction Details Card */}
      <View className="mx-4 mt-6 border-2 border-white/10 bg-transparent rounded-2xl overflow-hidden">
        {/* Bank Header Row */}
        <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-white/10">
          <View className="flex-row items-center flex-1">
            <View className="w-[50px] h-[30px] rounded-lg bg-white items-center justify-center mr-3 overflow-hidden">
              <Image 
                source={getBankLogo(bankName)}
                className="w-7 h-7"
                resizeMode="contain"
              />
            </View>
            <Text className="text-white text-sm font-medium">
              {bankName} ••••{bankAccountLast4}
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
              {upiTransactionId}
            </Text>
          </View>

          {/* To */}
          <View className="mb-[18px]">
            <Text className="text-white text-sm font-normal mb-[3px]">
              To: {toName}
            </Text>
            <Text className="text-[#9AA0A6] text-sm font-normal">
              {toApp}{toApp && toUpiId ? ' • ' : ''}{toUpiId}
            </Text>
          </View>

          {/* From */}
          <View className="mb-[18px]">
            <Text className="text-white text-sm font-normal mb-[3px]">
              From: {fromName ? `${fromName}${fromBank ? ` (${fromBank})` : ''}` : fromBank}
            </Text>
            <Text className="text-[#9AA0A6] text-sm font-normal">
              {fromApp}{fromApp && fromEmail ? ' • ' : ''}{fromEmail}
            </Text>
          </View>

          {/* Google Transaction ID */}
          <View>
            <Text className="text-white text-sm font-normal mb-[3px]">
              Google transaction ID
            </Text>
            <Text className="text-[#9AA0A6] text-sm font-normal">
              {googleTransactionId}
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
