import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import GooglePayScreenshotUI from '../components/GooglePayScreenshotUI';
import PaytmScreenshotUI from '../components/PaytmScreenshotUI';
import PhonePeScreenshotUI from '../components/PhonePeScreenshotUI';

export default function Screenshot() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    selectedApp: string;
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

  const [menuVisible, setMenuVisible] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

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

  const renderScreenshotUI = () => {
    switch (params.selectedApp) {
      case 'phonepe':
        return (
          <PhonePeScreenshotUI
            recipientName={params.recipientName}
            amount={params.amount}
            dateTime={params.dateTime}
            upiId={params.fromEmail || params.toUpiId}
            transactionId={params.upiTransactionId}
            bankAccountLast4={params.bankAccountLast4}
            utrNumber={params.googleTransactionId}
            toApp={params.toApp}
          />
        );
      case 'paytm':
        return (
          <PaytmScreenshotUI
            recipientName={params.recipientName}
            amount={params.amount}
            dateTime={params.dateTime}
            upiId={params.fromEmail || params.toUpiId}
            transactionId={params.upiTransactionId}
          />
        );
      case 'googlepay':
      default:
        return (
          <GooglePayScreenshotUI
            recipientName={params.recipientName}
            amount={params.amount}
            dateTime={params.dateTime}
            bankName={params.bankName}
            bankAccountLast4={params.bankAccountLast4}
            upiTransactionId={params.upiTransactionId}
            toName={params.toName}
            toApp={params.toApp}
            toUpiId={params.toUpiId}
            fromName={params.fromName}
            fromBank={params.fromBank}
            fromApp={params.fromApp}
            fromEmail={params.fromEmail}
            googleTransactionId={params.googleTransactionId}
          />
        );
    }
  };

  // Don't show header for PhonePe (it has its own green header)
  const showHeader = params.selectedApp !== 'phonepe';

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Fixed Header - Only for non-PhonePe */}
      {showHeader && (
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
      )}

      {/* PhonePe Header with back button overlay */}
      {!showHeader && (
        <View 
          className="absolute z-10 px-4"
          style={{ top: insets.top + 8 }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

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
        {renderScreenshotUI()}
      </ViewShot>
    </View>
  );
}
