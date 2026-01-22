import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, // Added Modal
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Material 3 Colors (Light)
const Colors = {
  background: '#FFFFFF',
  surface: '#F7F9FC', // Surface Container Low
  surfaceContainerHigh: '#E7E8EB', // For Bottom Sheet
  onSurface: '#191C1E',
  onSurfaceVariant: '#43474E',
  outline: '#747775',
  outlineVariant: '#C4C7C5',
  primary: '#0B57D0', // Google Blue M3
  onPrimary: '#FFFFFF',
  primaryContainer: '#D3E3FD',
  onPrimaryContainer: '#041E49',
  secondaryContainer: '#C2E7FF',
  onSecondaryContainer: '#001D35',
  error: '#BA1A1A',
};

// Payment app options
const PAYMENT_APPS = [
  {
    id: 'googlepay',
    name: 'Google Pay',
    logo: require('../assets/images/google-pay-logo.png'),
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    logo: require('../assets/images/phonepe-logo.png'),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    logo: require('../assets/images/paytm-logo.png'),
  },
];

// Bank options
const BANK_OPTIONS = [
  { label: 'State Bank of India', value: 'State Bank of India', icon: 'account-balance' },
  { label: 'HDFC Bank', value: 'HDFC Bank', icon: 'account-balance' },
  { label: 'ICICI Bank', value: 'ICICI Bank', icon: 'account-balance' },
  { label: 'Axis Bank', value: 'Axis Bank', icon: 'account-balance' },
  { label: 'Yes Bank', value: 'Yes Bank', icon: 'account-balance' },
];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Form state
  // ... (keeping state the same)
  const [selectedApp, setSelectedApp] = useState('googlepay');
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
  const [googleTransactionId, setGoogleTransactionId] = useState('');

  const getSelectedAppName = () => {
    return PAYMENT_APPS.find((app) => app.id === selectedApp)?.name || 'Google Pay';
  };

  const handleAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned) {
      const formatted = new Intl.NumberFormat('en-IN').format(parseInt(cleaned, 10));
      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  const handleGenerateScreenshot = () => {
    const params = new URLSearchParams({
      selectedApp,
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
      fromApp: getSelectedAppName(),
      googleTransactionId,
    });

    router.push(`/screenshot?${params.toString()}`);
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Main Container - Flex Column */}
      <View style={styles.mainContainer}>
        {/* Header - Fixed at Top */}
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Payment Screenshot</Text>
          <Text style={styles.headerSubtitle}>Create realistic payment screenshots</Text>
        </View>

        {/* KeyboardAvoidingView takes remaining space */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {/* ScrollView takes remaining space inside KAV */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* App Selector */}
            <Text style={styles.sectionTitle}>Select App</Text>
            <View style={styles.appSelectorContainer}>
              {PAYMENT_APPS.map((app) => {
                const selected = selectedApp === app.id;
                return (
                  <Pressable
                    key={app.id}
                    onPress={() => setSelectedApp(app.id)}
                    style={[
                      styles.appCard,
                      selected && styles.appCardSelected,
                    ]}
                  >
                    <View style={styles.appIconContainer}>
                      <Image source={app.logo} style={styles.appLogo} resizeMode="contain" />
                    </View>
                    <Text style={[styles.appName, selected && styles.appNameSelected]}>
                      {app.name}
                    </Text>
                    {selected && (
                      <View style={styles.checkmarkBadge}>
                        <MaterialIcons name="check" size={12} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Amount Input */}
            <Text style={styles.sectionTitle}>Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amountSymbol}>₹</Text>
              <TextInput
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor={Colors.outlineVariant}
                keyboardType="number-pad" 
                style={styles.amountInput}
              />
            </View>

            {/* Payment Details */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Payment Details</Text>
              <M3Input
                label="Recipient Name"
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="e.g., Shop Name"
              />
              <M3Input
                label="Date & Time"
                value={dateTime}
                onChangeText={setDateTime}
                placeholder="e.g., 16 Dec 2025, 2:20 pm"
              />
            </View>

            {/* Bank Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Bank Information</Text>
              <M3Dropdown
                label="Bank Name"
                value={bankName}
                onValueChange={setBankName}
                options={BANK_OPTIONS}
              />
              <M3Input
                label="Account Last 4 Digits"
                value={bankAccountLast4}
                onChangeText={setBankAccountLast4}
                placeholder="e.g., 1234"
                keyboardType="numeric"
              />
            </View>

            {/* Transaction IDs */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>Transaction IDs</Text>
              <M3Input
                label="UPI Transaction ID"
                value={upiTransactionId}
                onChangeText={setUpiTransactionId}
                placeholder="e.g., 123456789012"
                keyboardType="numeric"
              />
              <M3Input
                label="Google Transaction ID"
                value={googleTransactionId}
                onChangeText={setGoogleTransactionId}
                placeholder="e.g., CICAg..."
              />
            </View>

            {/* To (Recipient) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>To (Recipient)</Text>
              <M3Input
                label="To Name"
                value={toName}
                onChangeText={setToName}
                placeholder="e.g., John Doe"
              />
              <M3Input
                label="To Bank Last 4"
                value={toBankLast4}
                onChangeText={setToBankLast4}
                placeholder="e.g., 5678"
                keyboardType="numeric"
              />
              
              <Text style={styles.subLabel}>To App</Text>
              <View style={styles.miniAppSelector}>
                {PAYMENT_APPS.map((app) => {
                  const isSelected = toApp === app.name;
                  return (
                    <Pressable
                      key={app.id}
                      onPress={() => setToApp(app.name)}
                      style={[
                        styles.miniAppChip,
                        isSelected && styles.miniAppChipSelected,
                      ]}
                    >
                      <Image source={app.logo} style={styles.miniAppLogo} resizeMode="contain" />
                      <Text style={[styles.miniAppText, isSelected && styles.miniAppTextSelected]}>
                        {app.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <M3Input
                label="To UPI ID"
                value={toUpiId}
                onChangeText={setToUpiId}
                placeholder="e.g., shop@upi"
              />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>From (Sender)</Text>
              <M3Input
                label="From Name"
                value={fromName}
                onChangeText={setFromName}
                placeholder="e.g., Your Name"
              />
              <M3Input
                label="From Bank"
                value={fromBank}
                onChangeText={setFromBank}
                placeholder="e.g., SBI"
              />
              <M3Input
                label="From Email/UPI ID"
                value={fromEmail}
                onChangeText={setFromEmail}
                placeholder="e.g., you@upi"
              />
            </View>
            
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* 
            Footer/FAB with TouchableOpacity
          */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity
              onPress={handleGenerateScreenshot}
              activeOpacity={0.8}
              style={styles.fab}
            >
              <MaterialIcons name="auto-awesome" size={24} color={Colors.onPrimary} style={styles.fabIcon} />
              <Text style={styles.fabText}>Generate Screenshot</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

// M3 Outlined Text Field
function M3Input({ label, value, onChangeText, placeholder, keyboardType = 'default' }: any) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <Pressable onPress={() => {}} style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        { borderColor: isFocused ? Colors.primary : Colors.outline }
      ]}>
        <View style={styles.labelContainer}>
           <Text style={[
             styles.inputLabel,
             isFocused && styles.inputLabelFocused
           ]}>{label}</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={Colors.outlineVariant}
          keyboardType={keyboardType}
          style={styles.inputField}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Pressable>
    </View>
  );
}

// M3 Dropdown (New: Bottom Sheet Modal)
function M3Dropdown({ label, value, onValueChange, options }: any) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={styles.inputWrapper}>
        <Pressable
          onPress={() => setVisible(true)}
          style={[
            styles.inputContainer,
            visible && styles.inputContainerFocused,
            { borderColor: visible ? Colors.primary : Colors.outline }
          ]}
        >
          <View style={styles.labelContainer}>
            <Text style={[
              styles.inputLabel,
              visible && styles.inputLabelFocused
            ]}>{label}</Text>
          </View>
          <View style={styles.dropdownRow}>
            <Text style={[styles.inputField, !value && { color: Colors.onSurfaceVariant }]}>
              {value || 'Select Bank'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color={Colors.onSurfaceVariant} />
          </View>
        </Pressable>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.bottomSheet}>
                {/* Drag Handle */}
                <View style={styles.sheetHandleContainer}>
                  <View style={styles.sheetHandle} />
                </View>

                {/* Header */}
                <Text style={styles.sheetHeader}>{label}</Text>

                {/* Options List */}
                <ScrollView contentContainerStyle={styles.sheetContent}>
                  {options.map((opt: any) => {
                    const isSelected = value === opt.value;
                    return (
                      <Pressable
                        key={opt.value}
                        onPress={() => {
                          onValueChange(opt.value);
                          setVisible(false);
                        }}
                        style={[
                          styles.sheetOption,
                          isSelected && styles.sheetOptionSelected,
                        ]}
                        android_ripple={{ color: Colors.secondaryContainer }}
                      >
                         <View style={styles.optionRow}>
                           {/* Icon if available */}
                           <View style={[styles.optionIconContainer, isSelected && { backgroundColor: Colors.secondaryContainer }]}>
                             <MaterialIcons 
                               name={opt.icon || "account-balance"} 
                               size={24} 
                               color={isSelected ? Colors.onSecondaryContainer : Colors.onSurfaceVariant} 
                            />
                           </View>
                           <Text style={[
                             styles.optionLabel, 
                             isSelected && { color: Colors.onSecondaryContainer, fontWeight: '600' }
                            ]}>
                             {opt.label}
                           </Text>
                         </View>
                         
                         {/* Radio Button */}
                         <View style={styles.radioButton}>
                           {isSelected ? (
                             <MaterialIcons name="radio-button-checked" size={24} color={Colors.primary} />
                           ) : (
                             <MaterialIcons name="radio-button-unchecked" size={24} color={Colors.outline} />
                           )}
                         </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
    flexDirection: 'column', 
  },
  headerContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: Colors.onSurface,
    marginBottom: 4,
    includeFontPadding: false,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.onSurface,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.onSurface,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  
  // App Selector styles
  appSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  // ... (rest of app selector styles)
  appCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  appCardSelected: {
    backgroundColor: Colors.secondaryContainer,
    borderColor: Colors.primary,
  },
  appIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  appLogo: {
    width: 32,
    height: 32,
  },
  appName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  appNameSelected: {
    color: Colors.onSecondaryContainer,
    fontWeight: '600',
  },
  checkmarkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },

  // Amount
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 32,
  },
  amountSymbol: {
    fontSize: 24,
    color: Colors.onSurface,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    color: Colors.onSurface,
    fontWeight: '400',
    padding: 0,
  },

  // M3 Input
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
  },
  inputContainerFocused: {
    borderWidth: 2,
  },
  labelContainer: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: Colors.background,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.outlineVariant,
  },
  inputLabelFocused: {
    color: Colors.primary,
    fontWeight: '500',
  },
  inputField: {
    fontSize: 16,
    color: Colors.onSurface,
    height: '100%',
    paddingTop: 4,
  },

  // Dropdown
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // New Styles for Modal Dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
    maxHeight: '60%',
    elevation: 16,
  },
  sheetHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  sheetHandle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    opacity: 0.8,
  },
  sheetHeader: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 16,
  },
  sheetContent: {
    paddingHorizontal: 16,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  sheetOptionSelected: {
    backgroundColor: Colors.secondaryContainer,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 16,
    color: Colors.onSurface,
  },
  radioButton: {
    marginLeft: 8,
  },
  
  // Footer
  footer: {
    backgroundColor: Colors.background,
    paddingTop: 16,
    paddingHorizontal: 16,
    // Top border and shadow for separation
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, // Shadow casts upwards
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  fab: {
    backgroundColor: Colors.primary, // Reverted to Google Blue
    borderRadius: 32,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  fabIcon: {
    marginRight: 12,
  },
  fabText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  // Mini App Selector styles (missing from previous paste)
  subLabel: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
    marginTop: 8,
  },
  miniAppSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  miniAppChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  miniAppChipSelected: {
    backgroundColor: Colors.secondaryContainer,
    borderColor: Colors.secondaryContainer,
  },
  miniAppLogo: {
    width: 20,
    height: 20,
  },
  miniAppText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  miniAppTextSelected: {
    color: Colors.onSecondaryContainer,
    fontWeight: '500',
  },
});