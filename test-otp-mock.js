// Simple OTP mock test
class MockAuthService {
  constructor() {
    this.storedOTP = null;
    this.storedPhone = null;
  }

  sendOTP(phoneNumber) {
    console.log(`Sending OTP to: ${phoneNumber}`);
    this.storedOTP = '123456';
    this.storedPhone = phoneNumber;
    return {
      success: true,
      message: `OTP sent! Use: ${this.storedOTP}`
    };
  }

  verifyOTP(otp) {
    console.log(`Verifying OTP: "${otp}"`);
    console.log(`Stored OTP: "${this.storedOTP}"`);
    console.log(`Comparison: "${otp.trim()}" === "${this.storedOTP}" = ${otp.trim() === this.storedOTP}`);
    
    if (otp.trim() === this.storedOTP && this.storedPhone) {
      return {
        success: true,
        user: { id: 'test_user', name: 'Test User' },
        message: 'Login successful'
      };
    } else {
      return {
        success: false,
        message: `Invalid OTP. Expected: ${this.storedOTP}, Got: ${otp.trim()}`
      };
    }
  }
}

async function testOTP() {
  console.log('=== OTP MOCK TEST ===');
  
  const auth = new MockAuthService();
  
  // Test 1: Send OTP
  console.log('\n1. Sending OTP...');
  const sendResult = auth.sendOTP('+1234567890');
  console.log('Result:', sendResult);
  
  // Test 2: Verify correct OTP
  console.log('\n2. Verifying correct OTP...');
  const verifyResult = auth.verifyOTP('123456');
  console.log('Result:', verifyResult);
  
  // Test 3: Verify wrong OTP
  console.log('\n3. Verifying wrong OTP...');
  const wrongResult = auth.verifyOTP('999999');
  console.log('Result:', wrongResult);
  
  // Test 4: Verify with spaces
  console.log('\n4. Verifying OTP with spaces...');
  const spaceResult = auth.verifyOTP(' 123456 ');
  console.log('Result:', spaceResult);
}

testOTP();
