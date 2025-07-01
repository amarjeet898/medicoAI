import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { RootStackParamList, UserProfile } from '../constants/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { StorageService } from '../utils/Storage';

type SetupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Setup'>;
};

export const SetupScreen: React.FC<SetupScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: 0,
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: field === 'age' ? parseInt(value) || 0 : value,
    }));
  };

  const validateProfile = (): boolean => {
    if (!userProfile.name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }
    
    if (userProfile.age < 1 || userProfile.age > 120) {
      Alert.alert('Validation Error', 'Please enter a valid age (1-120)');
      return false;
    }

    if (!userProfile.email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userProfile.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleComplete = async () => {
    if (!validateProfile()) return;

    setIsLoading(true);
    try {
      // Save user profile
      await StorageService.saveUserProfile(userProfile);
      
      // Mark first launch as complete
      await StorageService.setFirstLaunchComplete();

      // Navigate to chat screen
      navigation.replace('Chat');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: colors.backgroundInput }]}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Setup Your Profile</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Help us personalize your medical learning experience
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundInput }]}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                  value={userProfile.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
            </View>

            {/* Age Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Age</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundInput }]}>
                <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your age"
                  placeholderTextColor={colors.textSecondary}
                  value={userProfile.age > 0 ? userProfile.age.toString() : ''}
                  onChangeText={(text) => handleInputChange('age', text)}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.backgroundInput }]}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email address"
                  placeholderTextColor={colors.textSecondary}
                  value={userProfile.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Info Box */}
            <View style={[styles.infoBox, { backgroundColor: colors.accentColor }]}>
              <Ionicons name="information-circle-outline" size={24} color={colors.tint} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Your information is stored locally on your device and used to personalize AI responses. 
                It helps provide more relevant medical education content.
              </Text>
            </View>
          </View>

          {/* Complete Button */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              { backgroundColor: colors.tint },
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleComplete}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>Setting up...</Text>
            ) : (
              <>
                <Text style={styles.buttonText}>Complete Setup</Text>
                <Ionicons name="checkmark-circle" size={20} color="white" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default SetupScreen;