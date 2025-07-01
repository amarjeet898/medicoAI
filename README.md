# 🩺 Medico AI - Intelligent Medical Assistant

A powerful React Native + Expo Android app designed for medical education and healthcare guidance, featuring AI-powered conversations, vision analysis, markdown/math rendering, and PDF export capabilities.

## ✨ Features

### 🔷 Core Functionality
- **Smart Medical Conversations**: GPT-style chat interface with medical-focused AI responses
- **Vision Analysis**: Analyze medical images with AI-powered computer vision
- **Multi-modal Support**: Text, image, and audio input processing
- **Local Storage**: All data stored securely on device using AsyncStorage
- **Professional PDF Export**: Generate beautiful PDF reports from conversations

### 🔷 User Experience
- **Onboarding Flow**: Welcome screen with medical branding and feature highlights
- **User Profile Setup**: Collect name, age, email for personalized responses
- **Beautiful UI**: Modern design with rounded corners, shadows, and smooth animations
- **Dark/Light Theme**: Automatic theme switching with custom color schemes
- **Responsive Design**: Optimized for all Android screen sizes

### 🔷 Advanced Features
- **Markdown Rendering**: Full support for tables, headings, lists, code blocks, quotes
- **LaTeX Math Support**: Render mathematical equations and scientific notation
- **Multiple AI Models**: Support for various AI models (OpenAI, Mistral, DeepSeek, etc.)
- **Image Processing**: Camera capture, gallery selection, and analysis
- **Audio Transcription**: Convert medical audio to text
- **Haptic Feedback**: Enhanced user interaction with vibrations
- **Settings Management**: Comprehensive settings with theme, model, and preference controls

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | React Native + Expo |
| **Language** | TypeScript |
| **Navigation** | React Navigation v7 |
| **Storage** | AsyncStorage |
| **Styling** | StyleSheet + Custom Theme System |
| **Icons** | Expo Vector Icons |
| **Markdown** | react-native-markdown-display |
| **API** | Pollinations.ai (OpenAI-compatible) |
| **PDF Generation** | react-native-html-to-pdf |
| **Animations** | React Native Reanimated |
| **Media** | Expo Image Picker, Document Picker |

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Physical Android device or emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MedicoAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   ```typescript
   // In api/MedicoAPI.ts, update the baseURL
   private static baseURL = 'https://text.pollinations.ai/openai';
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on Android**
   ```bash
   npm run android
   ```

### Building for Production

1. **Build APK**
   ```bash
   eas build -p android --profile preview
   ```

2. **Build AAB for Play Store**
   ```bash
   eas build -p android --profile production
   ```

## 📱 App Structure

```
/MedicoAI
├── /assets              # Images, logos, illustrations
├── /components          # Reusable UI components
│   ├── MarkdownRenderer.tsx
│   ├── ChatBubble.tsx
│   ├── LoadingSpinner.tsx
│   └── ...
├── /screens             # App screens
│   ├── OnboardingScreen.tsx
│   ├── SetupScreen.tsx
│   ├── ChatScreen.tsx
│   └── SettingsScreen.tsx
├── /utils               # Utility functions
│   ├── Storage.ts
│   ├── MediaUtils.ts
│   └── ...
├── /api                 # API services
│   └── MedicoAPI.ts
├── /constants           # App constants
│   ├── Colors.ts
│   ├── Fonts.ts
│   └── Types.ts
├── /pdf                 # PDF generation utilities
└── App.tsx              # Main app component
```

## 🔌 API Integration

The app integrates with Pollinations.ai using OpenAI-compatible endpoints:

### Text Generation
```typescript
const response = await MedicoAPI.sendMessage(
  prompt,
  chatHistory,
  userProfile,
  'mistral',  // model
  images      // optional images
);
```

### Vision Analysis
```typescript
const analysis = await MedicoAPI.analyzeImage(
  imageUrl,
  "Analyze this medical image",
  userProfile,
  'openai'
);
```

### Audio Transcription
```typescript
const transcription = await MedicoAPI.transcribeAudio(
  audioBase64,
  'mp3',
  userProfile
);
```

## 🎨 Theming System

The app supports multiple themes with automatic dark mode:

```typescript
// Available themes
const themes = {
  default: { primary: '#0c7ff2', accent: '#e0f2fe' },
  ocean: { primary: '#0ea5e9', accent: '#bae6fd' },
  forest: { primary: '#059669', accent: '#bbf7d0' },
  sunset: { primary: '#f59e42', accent: '#fed7aa' },
};
```

## 📋 Features Roadmap

### ✅ Completed
- [x] Onboarding flow
- [x] User profile setup
- [x] Basic navigation
- [x] Theme system
- [x] Storage utilities
- [x] API integration with vision support
- [x] Markdown renderer with LaTeX
- [x] Media utilities

### 🚧 In Progress
- [ ] Complete chat interface
- [ ] Settings modal implementation
- [ ] PDF export functionality
- [ ] Audio recording and playback

### 📅 Planned
- [ ] Push notifications
- [ ] Offline mode
- [ ] Export to cloud storage
- [ ] Voice commands
- [ ] Medical image templates
- [ ] Study mode with flashcards

## 🔒 Privacy & Security

- **Local Storage**: All user data stored locally on device
- **No Account Required**: App works without registration
- **HIPAA Awareness**: Designed with medical privacy in mind
- **Educational Purpose**: Clearly marked as educational tool only

## 🩺 Medical Disclaimer

This app provides educational content only and should not be used for medical diagnosis or treatment. Always consult qualified healthcare professionals for medical advice and patient care.

## 👨‍💻 Created By

**Sukhdev Singh**
- GitHub: [@sukhdevr898](https://github.com/sukhdevr898)
- Instagram: [@sukh_rai898](https://instagram.com/sukh_rai898)
- Email: sukhdevr898@gmail.com

### Other Projects by Sukhdev Singh:
- AI-898 Dashboard
- Vision Model
- AI Deep Research
- Medical Advisor for Girl's Problems
- Timeline 898 (Students)
- AI-898 Chatbot (with Google collaboration)

*Special thanks to Chhaya Rathod, MBBS student, for inspiring this medical education tool.*

## 📄 License

This project is created for educational purposes. Please refer to the license file for usage terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Known Issues

- LaTeX rendering is simplified (converts to Unicode symbols)
- PDF export requires additional implementation
- Audio transcription needs OpenAI Audio model access

## 📞 Support

For support, email sukhdevr898@gmail.com or create an issue in the repository.

---

**Made with ❤️ for Medical Education**