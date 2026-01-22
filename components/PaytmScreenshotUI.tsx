import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface PaytmScreenshotUIProps {
  recipientName?: string;
  amount?: string;
  dateTime?: string;
  upiId?: string;
  transactionId?: string;
  onScroll?: (offsetY: number) => void;
}

export default function PaytmScreenshotUI({
  recipientName = '',
  amount = '',
  dateTime = '',
  upiId = '',
  transactionId = '',
  onScroll,
}: PaytmScreenshotUIProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#1C2536]">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => onScroll?.(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {/* Success Icon */}
        <View className="items-center mt-12">
          <View className="w-20 h-20 rounded-full bg-[#00B9F5] items-center justify-center">
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </View>
        </View>

        {/* Success Text */}
        <Text className="text-white text-2xl font-bold text-center mt-6">
          Payment Successful
        </Text>
        <Text className="text-[#8E9AAF] text-sm text-center mt-2">
          {dateTime}
        </Text>

        {/* Amount */}
        <Text className="text-white text-4xl font-bold text-center mt-6">
          ₹{amount}
        </Text>

        {/* Recipient Info */}
        <View className="mx-6 mt-8 p-4 rounded-xl bg-[#263248]">
          <Text className="text-[#8E9AAF] text-xs mb-1">Paid to</Text>
          <Text className="text-white text-lg font-semibold">{recipientName}</Text>
          <Text className="text-[#8E9AAF] text-sm mt-1">{upiId}</Text>
        </View>

        {/* Transaction Details */}
        <View className="mx-6 mt-4 p-4 rounded-xl bg-[#263248]">
          <Text className="text-[#8E9AAF] text-xs mb-1">Transaction ID</Text>
          <Text className="text-white text-sm font-medium">{transactionId}</Text>
        </View>

        {/* Paytm branding */}
        <View className="items-center mt-12">
          <Text className="text-[#00B9F5] text-xl font-bold">Paytm</Text>
          <Text className="text-[#8E9AAF] text-xs mt-1">Powered by UPI</Text>
        </View>
      </ScrollView>
    </View>
  );
}
