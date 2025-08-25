import { TeacherPayment, Teacher } from "./src/models/index.model.js";

async function testTeacherPayment() {
  try {
    console.log('Testing teacher payment creation...');
    
    const payment = await TeacherPayment.create({
      teacherId: 1,
      hours: 10,
      rate: 5000,
      total: 50000,
      period: 'day',
      date: new Date().toISOString().split('T')[0],
      reference: `TEACH-${Date.now()}`
    });
    
    console.log('Payment created:', payment.toJSON());
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testTeacherPayment();