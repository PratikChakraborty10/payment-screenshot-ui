import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Bank options for the dropdown
const BANK_OPTIONS = [
  { label: 'State Bank of India', value: 'State Bank of India' },
  { label: 'HDFC Bank', value: 'HDFC Bank' },
  { label: 'ICICI Bank', value: 'ICICI Bank' },
  { label: 'Axis Bank', value: 'Axis Bank' },
];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form state
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountLast4, setBankAccountLast4] = useState('');
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [toName, setToName] = useState('');
  const [toBankLast4, setToBankLast4] = useState('');
  const [toUpiId, setToUpiId] = useState('');
  const [toApp, setToApp] = useState('');
  const [fromName, setFromName] = useState('');
  const [fromBank, setFromBank] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromApp, setFromApp] = useState('');
  const [googleTransactionId, setGoogleTransactionId] = useState('');

  const handleGenerateScreenshot = () => {
    const params = new URLSearchParams({
      recipientName,
      amount,
      dateTime,
      bankName,
      bankAccountLast4,
      upiTransactionId,
      toName,
      toBankLast4,
      toUpiId,
      toApp,
      fromName,
      fromBank,
      fromEmail,
      fromApp,
      googleTransactionId,
    });

    router.push(`/screenshot?${params.toString()}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#121212]"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View 
          className="px-5 pb-6"
          style={{ paddingTop: insets.top + 20 }}
        >
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full bg-[#1A73E8] items-center justify-center mr-3">
              <Ionicons name="card" size={20} color="#FFFFFF" />
            </View>
            <Text className="text-white text-xl font-semibold">
              GPay Generator
            </Text>
          </View>
          <Text className="text-[#9AA0A6] text-sm mt-1">
            Create realistic payment screenshots
          </Text>
        </View>

        {/* Amount Card - Hero Section */}
        <View className="mx-5 mb-6 p-5 rounded-2xl bg-[#1E1E1E] border border-[#2D2D2D]">
          <Text className="text-[#9AA0A6] text-xs uppercase tracking-wider mb-3">Amount</Text>
          <View className="flex-row items-center">
            <Text className="text-[#1A73E8] text-3xl font-light mr-1">₹</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="37,742"
              placeholderTextColor="#666"
              keyboardType="default"
              className="text-white text-4xl font-medium flex-1"
            />
          </View>
        </View>

        {/* Payment Details Section */}
        <SectionCard title="Payment Details" icon="person-outline">
          <InputField
            label="Recipient Name"
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="e.g., 10 sports"
          />
          <InputField
            label="Date & Time"
            value={dateTime}
            onChangeText={setDateTime}
            placeholder="e.g., 16 Dec 2025, 2:20 pm"
          />
        </SectionCard>

        {/* Bank Information Section */}
        <SectionCard title="Bank Information" icon="business-outline">
          <BankSelect
            label="Bank Name"
            value={bankName}
            onValueChange={setBankName}
            options={BANK_OPTIONS}
          />
          <InputField
            label="Account Last 4 Digits"
            value={bankAccountLast4}
            onChangeText={setBankAccountLast4}
            placeholder="e.g., 8782"
            keyboardType="numeric"
          />
        </SectionCard>

        {/* Transaction IDs Section */}
        <SectionCard title="Transaction IDs" icon="document-text-outline">
          <InputField
            label="UPI Transaction ID"
            value={upiTransactionId}
            onChangeText={setUpiTransactionId}
            placeholder="e.g., 535021699498"
          />
          <InputField
            label="Google Transaction ID"
            value={googleTransactionId}
            onChangeText={setGoogleTransactionId}
            placeholder="e.g., CICAgOibo_OzJw"
          />
        </SectionCard>

        {/* To (Recipient) Section */}
        <SectionCard title="To (Recipient)" icon="arrow-forward-outline">
          <InputField
            label="To Name"
            value={toName}
            onChangeText={setToName}
            placeholder="e.g., John Doe or Shop Name"
          />
          <InputField
            label="To Bank Last 4 Digits"
            value={toBankLast4}
            onChangeText={setToBankLast4}
            placeholder="e.g., 7820"
            keyboardType="numeric"
          />
          <InputField
            label="To App"
            value={toApp}
            onChangeText={setToApp}
            placeholder="e.g., Google Pay"
          />
          <InputField
            label="To UPI ID"
            value={toUpiId}
            onChangeText={setToUpiId}
            placeholder="e.g., johndoe-1@okicici"
          />
        </SectionCard>

        {/* From (Sender) Section */}
        <SectionCard title="From (Sender)" icon="arrow-back-outline">
          <InputField
            label="From Name"
            value={fromName}
            onChangeText={setFromName}
            placeholder="e.g., John Doe"
          />
          <InputField
            label="From Bank"
            value={fromBank}
            onChangeText={setFromBank}
            placeholder="e.g., State Bank of India"
          />
          <InputField
            label="From App"
            value={fromApp}
            onChangeText={setFromApp}
            placeholder="e.g., Google Pay"
          />
          <InputField
            label="From Email/UPI ID"
            value={fromEmail}
            onChangeText={setFromEmail}
            placeholder="e.g., johndoe@oksbi"
          />
        </SectionCard>

        {/* Generate Button */}
        <View className="px-5 mt-2">
          <TouchableOpacity
            onPress={handleGenerateScreenshot}
            className="bg-[#1A73E8] py-4 rounded-full flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white text-base font-semibold">
              Generate Screenshot
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Section Card Component
interface SectionCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}

function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <View className="mx-5 mb-4 p-4 rounded-xl bg-[#1E1E1E] border border-[#2D2D2D]">
      <View className="flex-row items-center mb-4">
        <Ionicons name={icon} size={18} color="#1A73E8" style={{ marginRight: 8 }} />
        <Text className="text-white text-base font-medium">{title}</Text>
      </View>
      {children}
    </View>
  );
}

// Input Field Component
interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}: InputFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-[#9AA0A6] text-xs uppercase tracking-wide mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#555"
        keyboardType={keyboardType}
        className="bg-[#2A2A2A] text-white px-4 py-3 rounded-lg text-sm"
      />
    </View>
  );
}

// Bank Select Component
interface BankSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}

function BankSelect({ label, value, onValueChange, options }: BankSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-[#9AA0A6] text-xs uppercase tracking-wide mb-2">{label}</Text>
      <TouchableOpacity 
        onPress={() => setIsOpen(!isOpen)}
        className="bg-[#2A2A2A] px-4 py-3 rounded-lg flex-row items-center justify-between"
      >
        <Text className={value ? "text-white text-sm" : "text-[#555] text-sm"}>
          {value || "Select a bank"}
        </Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color="#9AA0A6" />
      </TouchableOpacity>
      
      {isOpen && (
        <View className="bg-[#2A2A2A] mt-1 rounded-lg overflow-hidden border border-[#3A3A3A]">
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-3 ${index !== options.length - 1 ? 'border-b border-[#3A3A3A]' : ''} ${value === option.value ? 'bg-[#1A73E8]/20' : ''}`}
            >
              <Text className={`text-sm ${value === option.value ? 'text-[#1A73E8]' : 'text-white'}`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}