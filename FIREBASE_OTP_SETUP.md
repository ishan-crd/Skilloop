# 🔥 Firebase OTP Authentication Setup Guide

## 📋 **Prerequisites**
- Firebase project created
- React Native/Expo app
- Android Studio (for Android setup)
- Xcode (for iOS setup)

## 🚀 **Step 1: Firebase Console Setup**

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "Skilloop"
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Phone Authentication
1. Go to **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Toggle **Enable**
4. Click **Save**

### 1.3 Get Project Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** → **Web app** (</> icon)
4. Register app with nickname: "Skilloop Web"
5. Copy the config object

## 📱 **Step 2: Update Firebase Config**

Replace the config in `config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 🔧 **Step 3: Install Required Dependencies**

```bash
# Install Firebase
npm install firebase

# For Expo managed workflow
npx expo install firebase

# For bare React Native
npm install @react-native-firebase/app @react-native-firebase/auth
```

## 📱 **Step 4: Platform-Specific Setup**

### 4.1 Android Setup

1. **Download google-services.json**:
   - Go to Firebase Console → Project Settings
   - Add Android app
   - Package name: `com.yourcompany.skilloop`
   - Download `google-services.json`
   - Place in `android/app/` directory

2. **Update android/app/build.gradle**:
```gradle
dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-auth'
}
```

3. **Update android/build.gradle**:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

### 4.2 iOS Setup

1. **Download GoogleService-Info.plist**:
   - Add iOS app in Firebase Console
   - Bundle ID: `com.yourcompany.skilloop`
   - Download `GoogleService-Info.plist`
   - Add to Xcode project

2. **Update ios/Podfile**:
```ruby
pod 'Firebase/Auth'
```

3. **Run pod install**:
```bash
cd ios && pod install
```

## 🌐 **Step 5: Web Setup (for Expo)**

1. **Add reCAPTCHA container** to your HTML:
```html
<div id="recaptcha-container"></div>
```

2. **Update app.json**:
```json
{
  "expo": {
    "web": {
      "config": {
        "firebase": {
          "apiKey": "your-api-key",
          "authDomain": "your-project.firebaseapp.com",
          "projectId": "your-project-id"
        }
      }
    }
  }
}
```

## 🧪 **Step 6: Test OTP Authentication**

### 6.1 Test Phone Numbers
- Use test phone numbers for development
- Go to Firebase Console → Authentication → Sign-in method → Phone
- Add test phone numbers with test OTPs

### 6.2 Test OTP Flow
1. Enter phone number: `+1 650-555-3434`
2. Use test OTP: `123456`
3. Verify authentication works

## 🔒 **Step 7: Security Rules**

### 7.1 Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7.2 Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚨 **Step 8: Production Setup**

### 8.1 Enable App Verification
1. Go to Firebase Console → Authentication → Settings
2. Add your app's SHA-1 fingerprint
3. Add authorized domains

### 8.2 Configure OTP Templates
1. Go to Authentication → Templates
2. Customize SMS templates
3. Add your app name and branding

### 8.3 Set Up Monitoring
1. Enable Firebase Analytics
2. Set up Crashlytics
3. Monitor authentication metrics

## 🐛 **Common Issues & Solutions**

### Issue 1: "reCAPTCHA verification failed"
**Solution**: Add reCAPTCHA container to your HTML

### Issue 2: "Invalid phone number format"
**Solution**: Ensure phone number starts with country code (+1, +91, etc.)

### Issue 3: "SMS quota exceeded"
**Solution**: 
- Use test phone numbers for development
- Upgrade Firebase plan for production
- Implement rate limiting

### Issue 4: "App not authorized"
**Solution**: 
- Add SHA-1 fingerprint to Firebase Console
- Check package name matches Firebase config

## 📊 **Testing Checklist**

- [ ] Firebase project created
- [ ] Phone authentication enabled
- [ ] Config files added
- [ ] Dependencies installed
- [ ] Test phone numbers added
- [ ] OTP sending works
- [ ] OTP verification works
- [ ] User creation works
- [ ] Database integration works
- [ ] Error handling works

## 🎯 **Next Steps**

1. **Replace test config** with production config
2. **Add real SMS service** (Twilio, AWS SNS)
3. **Implement rate limiting**
4. **Add analytics tracking**
5. **Set up monitoring alerts**

## 📚 **Additional Resources**

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Phone Auth Guide](https://firebase.google.com/docs/auth/web/phone-auth)
- [React Native Firebase](https://rnfirebase.io/)
- [Expo Firebase Guide](https://docs.expo.dev/guides/using-firebase/)

---

**Need Help?** Check the Firebase Console logs and your app's console for detailed error messages.
