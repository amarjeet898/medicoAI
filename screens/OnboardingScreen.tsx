import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../constants/Types';
import { StackNavigationProp } from '@react-navigation/stack';

type OnboardingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const { width, height } = Dimensions.get('window');

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleGetStarted = () => {
    navigation.navigate('Setup');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, { backgroundColor: colors.tint }]}>
            <Ionicons name="medical" size={60} color="white" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Medico AI</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your Intelligent Medical Assistant
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.accentColor }]}>
              <Ionicons name="chatbubbles" size={24} color={colors.tint} />
            </View>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Smart Conversations</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Get detailed medical knowledge and educational guidance
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.accentColor }]}>
              <Ionicons name="camera" size={24} color={colors.tint} />
            </View>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Image Analysis</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Analyze medical images with AI-powered vision capabilities
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.accentColor }]}>
              <Ionicons name="document-text" size={24} color={colors.tint} />
            </View>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Rich Content</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Support for markdown, mathematical formulas, and scientific notation
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.accentColor }]}>
              <Ionicons name="download" size={24} color={colors.tint} />
            </View>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>PDF Export</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Export your conversations to professional PDF documents
              </Text>
            </View>
          </View>
        </View>

        {/* Medical Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={[styles.illustrationPlaceholder, { backgroundColor: colors.accentColor }]}>
            <Ionicons name="heart-outline" size={80} color={colors.tint} />
            <Ionicons 
              name="pulse" 
              size={40} 
              color={colors.tint} 
              style={styles.pulseIcon}
            />
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
            This app provides educational content only. Always consult qualified healthcare professionals for medical advice.
          </Text>
          
          <TouchableOpacity
            style={[styles.getStartedButton, { backgroundColor: colors.tint }]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={styles.arrowIcon} />
          </TouchableOpacity>

          <Text style={[styles.credits, { color: colors.textSecondary }]}>
            Created by Sukhdev Singh • For Medical Education
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresSection: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  illustrationPlaceholder: {
    width: width * 0.6,
    height: width * 0.4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  bottomSection: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  getStartedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  credits: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default OnboardingScreen;