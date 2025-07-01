import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export interface ImagePickerResult {
  uri: string;
  base64?: string;
  type: string;
  fileName?: string;
}

export interface AudioPickerResult {
  uri: string;
  base64?: string;
  type: string;
  fileName?: string;
}

export class MediaUtils {
  // Request permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return cameraStatus === 'granted' && mediaLibraryStatus === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  // Pick image from gallery
  static async pickImageFromGallery(includeBase64: boolean = true): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permission denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: includeBase64,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          base64: asset.base64,
          type: asset.type || 'image',
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
        };
      }
      return null;
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      return null;
    }
  }

  // Take photo with camera
  static async takePhoto(includeBase64: boolean = true): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permission denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: includeBase64,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          base64: asset.base64,
          type: asset.type || 'image',
          fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        };
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }

  // Pick audio file
  static async pickAudioFile(): Promise<AudioPickerResult | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const base64 = await this.fileToBase64(asset.uri);
        
        return {
          uri: asset.uri,
          base64,
          type: asset.mimeType || 'audio/mp3',
          fileName: asset.name,
        };
      }
      return null;
    } catch (error) {
      console.error('Error picking audio file:', error);
      return null;
    }
  }

  // Convert file URI to base64
  static async fileToBase64(fileUri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      throw error;
    }
  }

  // Get image format from URI
  static getImageFormat(uri: string): string {
    const extension = uri.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'jpeg';
      case 'png':
        return 'png';
      case 'gif':
        return 'gif';
      case 'webp':
        return 'webp';
      default:
        return 'jpeg';
    }
  }

  // Get audio format from URI
  static getAudioFormat(uri: string): 'wav' | 'mp3' {
    const extension = uri.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'wav':
        return 'wav';
      case 'mp3':
      case 'm4a':
      case 'aac':
      default:
        return 'mp3';
    }
  }

  // Compress image if needed
  static async compressImage(uri: string, quality: number = 0.7): Promise<string> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality,
        allowsEditing: false,
      });

      // This is a simplified implementation
      // In a real app, you might use a proper image compression library
      return uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri;
    }
  }

  // Resize image dimensions while maintaining aspect ratio
  static calculateResizedDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number = 1024,
    maxHeight: number = 1024
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Validate file size
  static async validateFileSize(uri: string, maxSizeMB: number = 10): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && fileInfo.size) {
        const sizeMB = fileInfo.size / (1024 * 1024);
        return sizeMB <= maxSizeMB;
      }
      return false;
    } catch (error) {
      console.error('Error validating file size:', error);
      return false;
    }
  }

  // Create thumbnail for image
  static async createThumbnail(uri: string, size: number = 150): Promise<string> {
    try {
      // This would require a proper image manipulation library in a real implementation
      // For now, return the original URI
      return uri;
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      return uri;
    }
  }
}