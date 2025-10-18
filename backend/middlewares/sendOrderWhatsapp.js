import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Using Twilio WhatsApp API
const sendOrderWhatsApp = async (order, user) => {
  try {
    console.log('Starting WhatsApp notification process...');
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    let twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    // Validate Twilio credentials
    if (!accountSid || !authToken || !twilioWhatsAppNumber) {
      console.error('Twilio credentials not configured');
      console.log('TWILIO_ACCOUNT_SID:', accountSid ? 'SET ✅' : 'NOT SET ❌');
      console.log('TWILIO_AUTH_TOKEN:', authToken ? 'SET ✅' : 'NOT SET ❌');
      console.log('TWILIO_WHATSAPP_NUMBER:', twilioWhatsAppNumber ? 'SET ✅' : 'NOT SET ❌');
      return { success: false, error: 'Twilio credentials missing' };
    }

    // Ensure Twilio number has whatsapp: prefix
    if (!twilioWhatsAppNumber.startsWith('whatsapp:')) {
      twilioWhatsAppNumber = `whatsapp:${twilioWhatsAppNumber}`;
    }

    // Get user phone number
    let userWhatsAppNumber = order.address?.phone || user.addresses?.[0]?.phone;

    if (!userWhatsAppNumber) {
      console.log('User phone number not available in order or user addresses');
      return { success: false, error: 'Phone number not available' };
    }

    console.log('Original phone number:', userWhatsAppNumber);

    // Clean and format phone number
    userWhatsAppNumber = userWhatsAppNumber.replace(/\s+/g, '').replace(/^0+/, '');
    
    // Add country code if not present (default to India +91)
    if (!userWhatsAppNumber.startsWith('+')) {
      userWhatsAppNumber = `+91${userWhatsAppNumber}`;
    }

    // Add whatsapp: prefix for Twilio
    const formattedWhatsAppNumber = userWhatsAppNumber.startsWith('whatsapp:') 
      ? userWhatsAppNumber 
      : `whatsapp:${userWhatsAppNumber}`;

    console.log('📱 Formatted WhatsApp number:', formattedWhatsAppNumber);

    // Format order items for message
    const itemsList = order.items.map((item, index) => 
      `${index + 1}. ${item.name || 'Product'} x${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n');

    // Create WhatsApp message
    const message = `
🛍️ *Order Confirmation*

Hi ${user.name || 'Customer'},

Your order has been placed successfully! 

*Order ID:* ${order._id}
*Payment Method:* ${order.paymentMethod}
*Payment Status:* ${order.payment ? 'Paid ✅' : 'Pending ⏳'}

*Items Ordered:*
${itemsList}

*Total Amount:* ₹${order.amount}

*Delivery Address:*
${order.address.street || ''}
${order.address.city || ''}, ${order.address.state || ''} - ${order.address.zipcode || ''}
${order.address.country || ''}
Phone: ${order.address.phone || 'N/A'}

Your order will be delivered soon. Track your order status in your account.

Thank you for shopping with us! 🙏
    `.trim();

    console.log('Sending WhatsApp message...');
    console.log('From:', twilioWhatsAppNumber);
    console.log('To:', formattedWhatsAppNumber);

    // Send WhatsApp message via Twilio API
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        From: twilioWhatsAppNumber,
        To: formattedWhatsAppNumber,
        Body: message
      }),
      {
        auth: {
          username: accountSid,
          password: authToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('WhatsApp message sent successfully!');
    console.log('Message SID:', response.data.sid);
    console.log('Status:', response.data.status);
    
    return { success: true, messageSid: response.data.sid };

  } catch (error) {
    console.error('WhatsApp sending error:');
    
    if (error.response) {
      // Twilio API error
      console.error('Status:', error.response.status);
      console.error('Error Code:', error.response.data?.code);
      console.error('Error Message:', error.response.data?.message);
      console.error('More Info:', error.response.data?.more_info);
      
      // Common error codes explained
      if (error.response.data?.code === 21211) {
        console.error('Fix: Invalid phone number. Check the format.');
      } else if (error.response.data?.code === 63007) {
        console.error('Fix: User needs to send "join" message to Twilio sandbox first.');
      } else if (error.response.data?.code === 20003) {
        console.error('Fix: Invalid Twilio credentials. Check ACCOUNT_SID and AUTH_TOKEN.');
      }
    } else if (error.request) {
      console.error('Network error - no response received');
    } else {
      console.error('Error:', error.message);
    }
    
    return { success: false, error: error.message };
  }
};

export default sendOrderWhatsApp;