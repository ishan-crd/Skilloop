// Super simple OTP test
console.log('=== SIMPLE OTP TEST ===');

// Test 1: Basic string comparison
const storedOTP = '123456';
const enteredOTP = '123456';

console.log('Stored OTP:', storedOTP);
console.log('Entered OTP:', enteredOTP);
console.log('Are they equal?', storedOTP === enteredOTP);
console.log('Trimmed equal?', storedOTP === enteredOTP.trim());

// Test 2: Test the actual authService
const { authService } = require('./services/authService.ts');

async function testAuthService() {
  console.log('\n=== AUTH SERVICE TEST ===');
  
  // Send OTP
  console.log('1. Sending OTP...');
  const sendResult = await authService.sendOTP('+91 9876543210');
  console.log('Send result:', sendResult);
  
  // Verify OTP
  console.log('2. Verifying OTP with 123456...');
  const verifyResult = await authService.verifyOTP('123456');
  console.log('Verify result:', verifyResult);
}

testAuthService().catch(console.error);
