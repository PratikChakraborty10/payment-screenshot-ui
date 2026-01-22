import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// App logo mapping
const appLogos: Record<string, ImageSourcePropType> = {
  'Google Pay': require('../assets/images/google-pay-logo.png'),
  'PhonePe': require('../assets/images/phonepe-logo.png'),
  'Paytm': require('../assets/images/paytm-logo.png'),
};

const getAppLogo = (appName: string): ImageSourcePropType | null => {
  return appLogos[appName] || null;
};

export interface PhonePeScreenshotUIProps {
  recipientName?: string;
  amount?: string;
  dateTime?: string;
  upiId?: string;
  transactionId?: string;
  bankAccountLast4?: string;
  utrNumber?: string;
  toApp?: string;
  onScroll?: (offsetY: number) => void;
}

export default function PhonePeScreenshotUI({
  recipientName = '',
  amount = '',
  dateTime = '',
  upiId = '',
  transactionId = '',
  bankAccountLast4 = '',
  utrNumber = '',
  toApp = '',
  onScroll,
}: PhonePeScreenshotUIProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      {/* Green Header */}
      <View 
        className="bg-[#2E7D32] px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-center">
          <View className="flex-1" />
          <View className="items-center">
            <Text className="text-white text-lg font-semibold">Transaction Successful</Text>
            <Text className="text-white/80 text-xs mt-0.5">{dateTime}</Text>
          </View>
          <View className="flex-1" />
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => onScroll?.(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {/* Paid to Card */}
        <View className="mx-4 mt-4 p-4 rounded-xl bg-[#1C1C1E]">
          <Text className="text-[#8E8E93] text-sm mb-3">Paid to</Text>
          
          <View className="flex-row items-center">
            {/* Purple arrow icon */}
            <View className="w-12 h-12 rounded-full bg-[#5E35B1] items-center justify-center mr-3">
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" style={{ transform: [{ rotate: '-45deg' }] }} />
            </View>
            
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">{recipientName}</Text>
              <Text className="text-[#8E8E93] text-sm">{upiId}</Text>
            </View>
            
            <Text className="text-white text-xl font-semibold">₹{amount}</Text>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-[#3A3A3C] my-4" />

          {/* Sent to row */}
          <View className="flex-row items-center">
            <Text className="text-[#8E8E93] text-sm mr-2">Sent to  :</Text>
            {toApp && getAppLogo(toApp) && (
              <Image 
                source={getAppLogo(toApp)!}
                className="w-12 h-5 mr-2"
                resizeMode="contain"
              />
            )}
            {toApp && <Text className="text-[#8E8E93] text-sm">•</Text>}
            <Text className="text-white text-sm ml-2">{upiId}</Text>
          </View>
        </View>

        {/* Payment Details Card */}
        <View className="mx-4 mt-3 rounded-xl bg-[#1C1C1E] overflow-hidden">
          {/* Header */}
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-[#5E35B1]/20 items-center justify-center mr-3">
                <Ionicons name="document-text-outline" size={18} color="#5E35B1" />
              </View>
              <Text className="text-white text-base font-medium">Payment Details</Text>
            </View>
            <Ionicons name="chevron-up" size={20} color="#8E8E93" />
          </TouchableOpacity>

          {/* Details Content */}
          <View className="px-4 pb-4">
            {/* Transaction ID */}
            <View className="mb-4">
              <Text className="text-[#8E8E93] text-xs mb-1">Transaction ID</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-base font-medium">{transactionId}</Text>
                <TouchableOpacity>
                  <Ionicons name="copy-outline" size={20} color="#5E35B1" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Debited from */}
            <Text className="text-[#8E8E93] text-xs mb-2">Debited from</Text>
            <View className="flex-row items-center">
              {/* Bank icon */}
              <View className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-[#5E35B1] items-center justify-center mr-3">
                <Ionicons name="arrow-up" size={20} color="#5E35B1" />
              </View>
              
              <View className="flex-1">
                <Text className="text-white text-base font-medium">XXXXXX{bankAccountLast4}</Text>
                <Text className="text-[#8E8E93] text-sm">UTR: {utrNumber}</Text>
              </View>
              
              <View className="items-end">
                <Text className="text-white text-lg font-semibold">₹{amount}</Text>
                <TouchableOpacity>
                  <Ionicons name="copy-outline" size={18} color="#5E35B1" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-around mx-4 mt-6 py-4">
          <ActionButton icon="arrow-forward" label="Send Again" />
          <ActionButton icon="swap-horizontal" label="View History" />
          <ActionButton icon="git-compare-outline" label="Split Expense"/>
          <ActionButton icon="share-social" label="Share Receipt" />
        </View>

        {/* Contact Support */}
        <View className="mx-4 mt-4 p-4 rounded-xl bg-[#1C1C1E] flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full border border-[#8E8E93] items-center justify-center mr-3">
              <Ionicons name="help-outline" size={18} color="#8E8E93" />
            </View>
            <Text className="text-white text-base">Contact PhonePe Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </View>

        {/* Powered by Footer */}
        <View className="items-center mt-8 mb-4">
          <Text className="text-[#bfbfbf] text-sm mb-2">Powered by</Text>
          <View className="flex-row items-center">
            <Image 
              source={require('../assets/images/upi-color-logo.png')}
              className="w-12 h-5 mr-4"
              resizeMode="contain"
            />
            <Image 
              source={require('../assets/images/yes-bank-logo.png')}
              className="w-12 h-5 mr-4"
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Action Button Component
function ActionButton({ 
  icon, 
  label, 
  filled = false 
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  label: string; 
  filled?: boolean;
}) {
  return (
    <View className="items-center">
      <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
        filled ? 'bg-[#5E35B1]' : 'bg-[#2C2C2E]'
      }`}>
        <Ionicons 
          name={icon} 
          size={22} 
          color={filled ? '#FFFFFF' : '#5E35B1'} 
        />
      </View>
      <Text className="text-[#8E8E93] text-xs text-center w-16">{label}</Text>
    </View>
  );
}
