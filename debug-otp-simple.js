// Simple OTP debug test
const { AuthService } = require('./services/authService.ts');

async function testOTP() {
  console.log('=== OTP DEBUG TEST ===');
  
  const authService = AuthService.getInstance();
  
  // Test 1: Send OTP
  console.log('1. Sending OTP...');
  const sendResult = await authService.sendOTP('+1234567890');
  console.log('Send result:', sendResult);
  
  // Test 2: Verify OTP
  console.log('2. Verifying OTP...');
  const verifyResult = await authService.verifyOTP('123456');
  console.log('Verify result:', verifyResult);
  
  // Test 3: Verify wrong OTP
  console.log('3. Verifying wrong OTP...');
  const wrongResult = await authService.verifyOTP('999999');
  console.log('Wrong OTP result:', wrongResult);
}

testOTP().catch(console.error);
