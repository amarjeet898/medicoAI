import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

// Screens
import OnboardingScreen from './screens/OnboardingScreen';
import SetupScreen from './screens/SetupScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';

// Types and Utils
import { RootStackParamList } from './constants/Types';
import { StorageService } from './utils/Storage';
import { Colors } from './constants/Colors';

const Stack = createStackNavigator<RootStackParamList>();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    async function prepare() {
      try {
        // Check if this is the first launch
        const firstLaunch = await StorageService.isFirstLaunch();
        setIsFirstLaunch(firstLaunch);
        
        // Pre-load any required resources here
        // await Font.loadAsync(...);
        
        // Simulate loading time (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isFirstLaunch ? 'Onboarding' : 'Chat'}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen 
            name="Setup" 
            component={SetupScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              presentation: 'modal',
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateY: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.height, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          />
        </Stack.Navigator>
        <StatusBar 
          style={colorScheme === 'dark' ? 'light' : 'dark'} 
          backgroundColor={colors.background}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}