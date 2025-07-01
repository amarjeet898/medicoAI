import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Settings, ChatHistory, ChatMessage } from '../constants/Types';

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  SETTINGS: 'settings',
  CHAT_HISTORY: 'chat_history',
  FIRST_LAUNCH: 'first_launch',
};

export class StorageService {
  // User Profile
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Settings
  static async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<Settings | null> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  // Chat History
  static async saveChatHistory(history: ChatHistory): Promise<void> {
    try {
      const serializedHistory = {
        ...history,
        messages: history.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
        lastUpdated: history.lastUpdated.toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(serializedHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
      throw error;
    }
  }

  static async getChatHistory(): Promise<ChatHistory | null> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!history) return null;
      
      const parsed = JSON.parse(history);
      return {
        ...parsed,
        messages: parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        lastUpdated: new Date(parsed.lastUpdated),
      };
    } catch (error) {
      console.error('Error getting chat history:', error);
      return null;
    }
  }

  static async addMessageToHistory(message: ChatMessage): Promise<void> {
    try {
      const existingHistory = await this.getChatHistory();
      const newHistory: ChatHistory = existingHistory || { messages: [], lastUpdated: new Date() };
      
      newHistory.messages.push(message);
      newHistory.lastUpdated = new Date();
      
      await this.saveChatHistory(newHistory);
    } catch (error) {
      console.error('Error adding message to history:', error);
      throw error;
    }
  }

  static async clearChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  // First Launch
  static async isFirstLaunch(): Promise<boolean> {
    try {
      const firstLaunch = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      return firstLaunch === null;
    } catch (error) {
      console.error('Error checking first launch:', error);
      return true;
    }
  }

  static async setFirstLaunchComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
    } catch (error) {
      console.error('Error setting first launch complete:', error);
      throw error;
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_PROFILE,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.CHAT_HISTORY,
        STORAGE_KEYS.FIRST_LAUNCH,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}