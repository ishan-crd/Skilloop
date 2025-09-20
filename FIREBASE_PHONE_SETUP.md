# 🔥 Firebase Phone Authentication Setup Guide

## 🚨 **CRITICAL: Enable Phone Authentication First!**

The `auth/internal-error` occurs because Phone Authentication is not enabled in your Firebase project.

### **Step 1: Enable Phone Authentication**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `skilloop-a368d`
3. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Sign-in method" tab
4. **Enable Phone Provider**:
   - Find "Phone" in the list
   - Click on it
   - Toggle "Enable" to ON
   - Click "Save"

### **Step 2: Add Test Phone Numbers**

1. **In the Phone provider settings**:
   - Scroll down to "Test phone numbers"
   - Click "Add phone number"
   - Add these test numbers:
     - **Phone**: `+1 650-555-3434`
     - **Code**: `123456`
     - **Phone**: `+1 650-555-3435`
     - **Code**: `123456`
     - **Phone**: `+1 650-555-3436`
     - **Code**: `123456`

### **Step 3: Test the Setup**

1. **Open the test file**: `firebase-test-simple.html` in your browser
2. **Use test phone number**: `+1 650-555-3434`
3. **Use test OTP**: `123456`

## 🔧 **Troubleshooting**

### **Error: auth/internal-error**
- **Cause**: Phone Authentication not enabled
- **Solution**: Enable Phone provider in Firebase Console

### **Error: auth/invalid-phone-number**
- **Cause**: Wrong phone number format
- **Solution**: Use format `+1234567890`

### **Error: auth/missing-recaptcha-token**
- **Cause**: reCAPTCHA not properly configured
- **Solution**: Use the simple test file with invisible reCAPTCHA

### **Error: auth/quota-exceeded**
- **Cause**: SMS quota exceeded
- **Solution**: Use test phone numbers instead of real numbers

## 📱 **For React Native/Expo**

Since you're using Expo, the current setup will use **simulated OTP** for testing:

1. **Enter any phone number**: `+91 9876543210`
2. **Click "Send OTP"**: Will show "OTP sent successfully (simulated)"
3. **Enter OTP**: `123456`
4. **Verify**: Should work with simulated authentication

## 🎯 **Next Steps**

1. **Enable Phone Authentication** in Firebase Console
2. **Add test phone numbers**
3. **Test with the simple test file**
4. **Use simulated OTP for React Native testing**

---

**The main issue is that Phone Authentication is not enabled in your Firebase project!** 🚨
