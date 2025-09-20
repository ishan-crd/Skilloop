// Completely isolated OTP test - no database, no imports
console.log('=== ISOLATED OTP TEST ===');

class SimpleAuthService {
  constructor() {
    this.storedOTP = null;
    this.storedPhone = null;
  }

  async sendOTP(phoneNumber) {
    console.log(`Sending OTP to ${phoneNumber}`);
    this.storedOTP = '123456';
    this.storedPhone = phoneNumber;
    console.log(`Stored OTP: ${this.storedOTP}, Phone: ${this.storedPhone}`);
    return {
      success: true,
      message: `OTP sent successfully! Use OTP: ${this.storedOTP}`
    };
  }

  async verifyOTP(otp) {
    console.log(`Verifying OTP: "${otp}"`);
    console.log(`Stored OTP: "${this.storedOTP}", Phone: "${this.storedPhone}"`);
    console.log(`Comparison: "${otp.trim()}" === "${this.storedOTP}" = ${otp.trim() === this.storedOTP}`);
    
    if (otp.trim() === this.storedOTP && this.storedPhone) {
      return {
        success: true,
        user: { id: 'test-user', phone: this.storedPhone },
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

async function test() {
  const auth = new SimpleAuthService();
  
  console.log('\n1. Sending OTP...');
  const sendResult = await auth.sendOTP('+91 9876543210');
  console.log('Send result:', sendResult);
  
  console.log('\n2. Verifying OTP with 123456...');
  const verifyResult = await auth.verifyOTP('123456');
  console.log('Verify result:', verifyResult);
  
  console.log('\n3. Verifying OTP with wrong code...');
  const wrongResult = await auth.verifyOTP('654321');
  console.log('Wrong result:', wrongResult);
}

test().catch(console.error);
