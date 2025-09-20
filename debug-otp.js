// Simple OTP debug test
const authService = require('./services/authService.ts');

async function testOTP() {
  console.log('=== OTP Debug Test ===');
  
  // Test 1: Send OTP
  console.log('1. Sending OTP...');
  const sendResult = await authService.sendOTP('+91 9876543210');
  console.log('Send result:', sendResult);
  
  if (sendResult.success) {
    // Extract OTP from message
    const otpMatch = sendResult.message.match(/Use OTP: (\d+)/);
    if (otpMatch) {
      const otp = otpMatch[1];
      console.log('2. Extracted OTP:', otp);
      
      // Test 2: Verify OTP
      console.log('3. Verifying OTP...');
      const verifyResult = await authService.verifyOTP(otp);
      console.log('Verify result:', verifyResult);
    } else {
      console.log('Could not extract OTP from message');
    }
  }
}

testOTP().catch(console.error);
