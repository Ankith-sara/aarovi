import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import productModel from '../models/ProductModal.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
});

const sendOrderMail = async (email, subject, text, html) => {
    if (!email || !subject) {
        console.error('Missing email or subject for order mail');
        return false;
    }
    const mailOptions = {
        from: `"Aarovi" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text,
        html,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Order email sent successfully to ${email}:`, info.messageId);
        return true;
    } catch (error) {
        console.error(`Error sending order email to ${email}:`, error.message);
        return false;
    }
};

const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Helper function to get payment status badge
const getPaymentBadge = (paymentMethod, isPaid) => {
    if (paymentMethod === 'COD') {
        return '<span style="display: inline-block; background: #4F200D; color: #ffffff; padding: 8px 20px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px;">Cash on Delivery</span>';
    }
    return isPaid ?
        '<span style="display: inline-block; background: #2e7d32; color: #ffffff; padding: 8px 20px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px;">Paid</span>' :
        '<span style="display: inline-block; background: #d32f2f; color: #ffffff; padding: 8px 20px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px;">Pending</span>';
};

// Send shipping notification email
const sendShippingEmail = async (orderData, user) => {
    try {
        const { _id: orderId, items, address, amount } = orderData;
        
        if (!user || !user.email) {
            console.error('User data incomplete for shipping email');
            return false;
        }

        const subject = `Your Aarovi Order #${orderId} Has Been Shipped`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Shipped - Aarovi</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                </style>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #FCFAFA 0%, #ffffff 100%); color: #131010;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #FCFAFA 0%, #EBD9D1 100%); min-height: 100vh;">
                    <tr>
                        <td align="center" style="padding: 60px 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 10px 40px rgba(79, 32, 13, 0.12); border-radius: 4px; overflow: hidden;">
                                
                                <tr>
                                    <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                                </tr>

                                <tr>
                                    <td style="padding: 50px 50px 40px; text-align: center; background: #ffffff; border-bottom: 2px solid #EBD9D1;">
                                        <h1 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 48px; font-weight: 600; letter-spacing: 4px; color: #4F200D; text-transform: uppercase;">AAROVI</h1>
                                        <div style="width: 60px; height: 2px; background: #4F200D; margin: 0 auto 16px;"></div>
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; color: #131010; text-transform: uppercase; font-weight: 600; opacity: 0.7;">Handcrafted Heritage · Timeless Elegance</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); padding: 18px 32px; text-align: center;">
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #ffffff; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">Your Order Is On Its Way</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 50px 50px 40px; text-align: center; background: #FCFAFA;">
                                        <h2 style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 600; letter-spacing: 1px; color: #4F200D; line-height: 1.2;">Package Shipped</h2>
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.8; max-width: 460px; margin: 0 auto; opacity: 0.85;">
                                            Great news, <strong style="font-weight: 700; color: #4F200D;">${user.name}</strong>. Your handcrafted treasures have been shipped and are making their way to you.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #ffffff; border-radius: 12px; overflow: hidden;">
                                            <tr>
                                                <td style="padding: 28px 32px; background: linear-gradient(135deg, #4F200D, #6B2D10); border-bottom: 2px solid #EBD9D1;">
                                                    <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #ffffff;">Shipment Details</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order Number</td>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 700; text-align: right;">#${orderId}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #EBD9D1;">
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Items Shipped</td>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 600; text-align: right;">${items.length} item(s)</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #EBD9D1;">
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order Total</td>
                                                            <td style="padding: 14px 0; font-family: 'Bodoni Moda', serif; font-size: 20px; color: #4F200D; font-weight: 600; text-align: right;">₹${amount.toLocaleString('en-IN')}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #FCFAFA; border-radius: 12px; overflow: hidden;">
                                            <tr>
                                                <td style="padding: 24px 32px; border-bottom: 1px solid #EBD9D1;">
                                                    <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #4F200D;">Delivering To</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.9;">
                                                        <strong style="font-weight: 700; color: #4F200D;">${address.firstName || ''} ${address.lastName || ''}</strong><br>
                                                        ${address.street || ''}<br>
                                                        ${address.city || ''}, ${address.state || ''} ${address.zipcode || ''}<br>
                                                        ${address.country || ''}<br>
                                                        <span style="color: #131010; margin-top: 8px; display: inline-block; opacity: 0.7;">Phone: ${address.phone || 'N/A'}</span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); border: 2px solid #F59E0B; border-left: 6px solid #D97706; border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <h3 style="margin: 0 0 14px 0; font-family: 'Bodoni Moda', serif; font-size: 22px; font-weight: 600; color: #92400E;">What's Next?</h3>
                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #78350F; font-weight: 500; line-height: 1.8;">
                                                        Your package is on its way. You'll receive another email once it's out for delivery. Please ensure someone is available to receive the package at the delivery address.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 40px 50px; text-align: center; background: linear-gradient(135deg, #FCFAFA, #EBD9D1); border-top: 2px solid #EBD9D1;">
                                        <p style="margin: 0 0 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                            Questions? Email us at <a href="mailto:aaroviofficial@gmail.com" style="color: #4F200D; text-decoration: none; font-weight: 700; border-bottom: 2px solid #EBD9D1;">aaroviofficial@gmail.com</a>
                                        </p>
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                            or call us at <a href="tel:+919399336666" style="color: #4F200D; text-decoration: none; font-weight: 700;">+91 9399336666</a>
                                        </p>
                                        
                                        <div style="margin: 24px 0 0 0; padding-top: 24px; border-top: 1px solid #EBD9D1;">
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #131010; font-weight: 400; opacity: 0.5; line-height: 1.6;">
                                                © ${new Date().getFullYear()} Aarovi Fashions. All rights reserved.<br>
                                                Handcrafted with care, delivered with love.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        return await sendOrderMail(user.email, subject, '', html);
    } catch (error) {
        console.error('Error sending shipping email:', error);
        return false;
    }
};

// Send delivered notification email
const sendDeliveredEmail = async (orderData, user) => {
    try {
        const { _id: orderId, items, amount } = orderData;
        
        if (!user || !user.email) {
            console.error('User data incomplete for delivered email');
            return false;
        }

        const subject = `Your Aarovi Order #${orderId} Has Been Delivered`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Delivered - Aarovi</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                </style>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #FCFAFA 0%, #ffffff 100%); color: #131010;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #FCFAFA 0%, #EBD9D1 100%); min-height: 100vh;">
                    <tr>
                        <td align="center" style="padding: 60px 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 10px 40px rgba(79, 32, 13, 0.12); border-radius: 4px; overflow: hidden;">
                                
                                <tr>
                                    <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                                </tr>

                                <tr>
                                    <td style="padding: 50px 50px 40px; text-align: center; background: #ffffff; border-bottom: 2px solid #EBD9D1;">
                                        <h1 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 48px; font-weight: 600; letter-spacing: 4px; color: #4F200D; text-transform: uppercase;">AAROVI</h1>
                                        <div style="width: 60px; height: 2px; background: #4F200D; margin: 0 auto 16px;"></div>
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; color: #131010; text-transform: uppercase; font-weight: 600; opacity: 0.7;">Handcrafted Heritage · Timeless Elegance</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%); padding: 18px 32px; text-align: center;">
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #ffffff; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">Delivery Confirmed</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 50px 50px 40px; text-align: center; background: #FCFAFA;">
                                        <h2 style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 600; letter-spacing: 1px; color: #4F200D; line-height: 1.2;">Your Order Has Arrived</h2>
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.8; max-width: 460px; margin: 0 auto; opacity: 0.85;">
                                            Congratulations, <strong style="font-weight: 700; color: #4F200D;">${user.name}</strong>. Your handcrafted treasures from Aarovi have been successfully delivered.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #ffffff; border-radius: 12px; overflow: hidden;">
                                            <tr>
                                                <td style="padding: 28px 32px; background: linear-gradient(135deg, #2e7d32, #388e3c); border-bottom: 2px solid #EBD9D1;">
                                                    <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #ffffff;">Delivery Details</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order Number</td>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 700; text-align: right;">#${orderId}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #EBD9D1;">
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Items Delivered</td>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 600; text-align: right;">${items.length} item(s)</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #EBD9D1;">
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Delivered On</td>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 600; text-align: right;">${formatDate(Date.now())}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #EBD9D1;">
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order Total</td>
                                                            <td style="padding: 14px 0; font-family: 'Bodoni Moda', serif; font-size: 20px; color: #4F200D; font-weight: 600; text-align: right;">₹${amount.toLocaleString('en-IN')}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <h3 style="margin: 0 0 20px 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #4F200D;">Items Delivered</h3>
                                        ${items.map((item, index) => `
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${index < items.length - 1 ? '16px' : '0'}; border: 2px solid #EBD9D1; background: #f0fdf4; border-radius: 8px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="width: 70%; vertical-align: top;">
                                                                    <img src="${item.image || item.images?.[0] || ''}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; margin-bottom: 10px; display: block;" />
                                                                    <h4 style="margin: 0 0 8px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 600; color: #4F200D;">${item.name || 'Product'}</h4>
                                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; opacity: 0.7;">Qty: ${item.quantity} ${item.size ? `· Size: ${item.size}` : ''}</p>
                                                                </td>
                                                                <td style="width: 30%; text-align: right; vertical-align: top;">
                                                                    <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 20px; color: #4F200D; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        `).join('')}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #2e7d32; border-left: 6px solid #1b5e20; border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <h3 style="margin: 0 0 14px 0; font-family: 'Bodoni Moda', serif; font-size: 22px; font-weight: 600; color: #1b5e20;">We'd Love Your Feedback</h3>
                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1b5e20; font-weight: 500; line-height: 1.8;">
                                                        We hope you love your new handcrafted pieces. Your feedback helps our artisans continue their craft. If you have a moment, please share your experience with us.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); border: 2px solid #F59E0B; border-left: 6px solid #D97706; border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <h4 style="margin: 0 0 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; color: #92400E; text-transform: uppercase; letter-spacing: 1px;">Need Help?</h4>
                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #78350F; font-weight: 500; line-height: 1.7;">
                                                        If there are any issues with your order, please contact us within 7 days of delivery.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 40px 50px; text-align: center; background: linear-gradient(135deg, #FCFAFA, #EBD9D1); border-top: 2px solid #EBD9D1;">
                                        <p style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; color: #4F200D; font-weight: 600; letter-spacing: 0.5px;">Thank you for choosing Aarovi</p>
                                        <p style="margin: 0 0 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                            Questions? Email us at <a href="mailto:aaroviofficial@gmail.com" style="color: #4F200D; text-decoration: none; font-weight: 700; border-bottom: 2px solid #EBD9D1;">aaroviofficial@gmail.com</a>
                                        </p>
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                            or call us at <a href="tel:+919399336666" style="color: #4F200D; text-decoration: none; font-weight: 700;">+91 9399336666</a>
                                        </p>
                                        
                                        <div style="margin: 24px 0 0 0; padding-top: 24px; border-top: 1px solid #EBD9D1;">
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #131010; font-weight: 400; opacity: 0.5; line-height: 1.6;">
                                                © ${new Date().getFullYear()} Aarovi Fashions. All rights reserved.<br>
                                                Handcrafted with care, delivered with love.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        return await sendOrderMail(user.email, subject, '', html);
    } catch (error) {
        console.error('Error sending delivered email:', error);
        return false;
    }
};

// Professional function to send both customer and admin emails
const sendOrderEmails = async (orderData, user) => {
    try {
        const { _id: orderId, amount, items, address, paymentMethod, payment, date } = orderData;

        // Validate required data
        if (!user || !user.email || !user.name) {
            console.error('User data is incomplete:', user);
            return false;
        }

        if (!items || items.length === 0) {
            console.error('No items in order');
            return false;
        }

        console.log(`Starting email send for order ${orderId} to ${user.email}`);

        // Find product owner (admin) for the first product to determine vendor
        let owner = null;
        try {
            const product = await productModel.findById(items[0].productId).populate("adminId");
            if (product && product.adminId) {
                owner = product.adminId;
            } else {
                console.error("Could not find product owner for order, skipping admin email");
            }
        } catch (error) {
            console.error("Error finding product owner:", error.message);
        }

        // === CUSTOMER EMAIL ===
        const customerSubject = `Your Aarovi Order #${orderId.toString()} is Confirmed`;

        const customerHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation - Aarovi</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                </style>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #FCFAFA 0%, #ffffff 100%); color: #131010;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #FCFAFA 0%, #EBD9D1 100%); min-height: 100vh;">
                    <tr>
                        <td align="center" style="padding: 60px 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 10px 40px rgba(79, 32, 13, 0.12); border-radius: 4px; overflow: hidden;">
                                
                                <!-- Decorative Top Border -->
                                <tr>
                                    <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                                </tr>

                                <!-- Header with Brand Identity -->
                                <tr>
                                    <td style="padding: 50px 50px 40px; text-align: center; background: #ffffff; border-bottom: 2px solid #EBD9D1;">
                                        <h1 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 48px; font-weight: 600; letter-spacing: 4px; color: #4F200D; text-transform: uppercase;">AAROVI</h1>
                                        <div style="width: 60px; height: 2px; background: #4F200D; margin: 0 auto 16px;"></div>
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; color: #131010; text-transform: uppercase; font-weight: 600; opacity: 0.7;">Handcrafted Heritage · Timeless Elegance</p>
                                    </td>
                                </tr>

                                <!-- Hero Section -->
                                <tr>
                                    <td style="padding: 0; background: #ffffff;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 50px 50px 40px; text-align: center; background: #FCFAFA;">
                                                    <div style="display: inline-block; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); color: #ffffff; padding: 10px 24px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(79, 32, 13, 0.25);">Order Confirmed</div>
                                                    <h2 style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 600; letter-spacing: 1px; color: #4F200D; line-height: 1.2;">Your Order is Confirmed</h2>
                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.8; max-width: 460px; margin: 0 auto; opacity: 0.85;">Thank you, <strong style="font-weight: 700; color: #4F200D;">${user.name}</strong>. Your order has been received and our artisans are preparing your handcrafted pieces with care.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Order Summary Card -->
                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #ffffff; border-radius: 12px; overflow: hidden;">
                                            <!-- Card Header -->
                                            <tr>
                                                <td style="padding: 28px 32px; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-bottom: 2px solid #EBD9D1;">
                                                    <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #ffffff;">Order Summary</h3>
                                                </td>
                                            </tr>
                                            
                                            <!-- Card Content -->
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order Number</td>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 700; text-align: right; letter-spacing: 0.5px;">#${orderId}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #EBD9D1;">
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order Date</td>
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 600; text-align: right;">${formatDate(date)}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #EBD9D1;">
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Payment Method</td>
                                                            <td style="padding: 14px 0; text-align: right;">${getPaymentBadge(paymentMethod, payment)}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #EBD9D1;">
                                                            <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Total Amount</td>
                                                            <td style="padding: 14px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; color: #4F200D; font-weight: 600; text-align: right; letter-spacing: 0.5px;">₹${amount.toLocaleString('en-IN')}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Order Items -->
                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <h3 style="margin: 0 0 20px 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #4F200D;">Your Items</h3>
                                        
                                        ${items.map((item, index) => `
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${index < items.length - 1 ? '16px' : '0'}; border: 2px solid #EBD9D1; background: #FCFAFA; border-radius: 8px;">
                                                <tr>
                                                    <td style="padding: 24px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="width: 70%; vertical-align: top;">
                                                                    <img 
                                                                        src="${item.image || item.images?.[0] || ''}" 
                                                                        alt="${item.name || 'Product Image'}" 
                                                                        style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-bottom: 12px; display: block;"
                                                                    />
                                                                    <h4 style="margin: 0 0 8px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 600; color: #4F200D; letter-spacing: 0.5px; line-height: 1.3;">
                                                                        ${item.name || 'Handcrafted Product'}
                                                                    </h4>
                                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; line-height: 1.7; opacity: 0.7;">
                                                                        Quantity: ${item.quantity}
                                                                        ${item.size ? ` · Size: ${item.size}` : ''}
                                                                    </p>
                                                                </td>
                                                                <td style="width: 30%; text-align: right; vertical-align: top;">
                                                                    <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 20px; color: #4F200D; font-weight: 600; letter-spacing: 0.5px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        `).join('')}
                                    </td>
                                </tr>

                                <!-- Delivery Address -->
                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #FCFAFA; border-radius: 12px; overflow: hidden;">
                                            <tr>
                                                <td style="padding: 24px 32px; border-bottom: 1px solid #EBD9D1;">
                                                    <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #4F200D;">Delivery Address</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.9;">
                                                        <strong style="font-weight: 700; color: #4F200D;">${address.firstName || ''} ${address.lastName || ''}</strong><br>
                                                        ${address.street || ''}<br>
                                                        ${address.city || ''}, ${address.state || ''} ${address.zipcode || ''}<br>
                                                        ${address.country || ''}<br>
                                                        <span style="color: #131010; margin-top: 8px; display: inline-block; opacity: 0.7;">Phone: ${address.phone || 'N/A'}</span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- What's Next Section -->
                                <tr>
                                    <td style="padding: 0 50px 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); border: 2px solid #F59E0B; border-left: 6px solid #D97706; border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <h3 style="margin: 0 0 14px 0; font-family: 'Bodoni Moda', serif; font-size: 22px; font-weight: 600; color: #92400E;">What Happens Next?</h3>
                                                    <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #78350F; font-weight: 500; line-height: 1.8;">
                                                        ${paymentMethod === 'COD' ?
                                                            'Your order is being carefully handcrafted by our artisans. We will notify you with tracking details once it ships. <strong style="font-weight: 700; color: #92400E;">Please keep the exact cash amount ready upon delivery.</strong>' :
                                                            'Your payment has been confirmed. Our master artisans are now preparing your order with the utmost care and attention to detail. You will receive tracking information once your package is dispatched.'
                                                        }
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Closing Message -->
                                <tr>
                                    <td style="padding: 40px 50px; text-align: center; background: linear-gradient(135deg, #FCFAFA, #EBD9D1); border-top: 2px solid #EBD9D1;">
                                        <p style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; color: #4F200D; font-weight: 600; letter-spacing: 0.5px;">Thank you for supporting handcrafted heritage</p>
                                        <div style="width: 60px; height: 1px; background: #4F200D; margin: 0 auto 24px;"></div>
                                        <p style="margin: 0 0 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                            Questions? Email us at <a href="mailto:aaroviofficial@gmail.com" style="color: #4F200D; text-decoration: none; font-weight: 700; border-bottom: 2px solid #EBD9D1;">aaroviofficial@gmail.com</a>
                                        </p>
                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                            or call us at <a href="tel:+919399336666" style="color: #4F200D; text-decoration: none; font-weight: 700;">+91 9399336666</a>
                                        </p>
                                        
                                        <div style="margin: 24px 0 0 0; padding-top: 24px; border-top: 1px solid #EBD9D1;">
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #131010; font-weight: 400; opacity: 0.5; line-height: 1.6;">
                                                © ${new Date().getFullYear()} Aarovi Fashions. All rights reserved.<br>
                                                Handcrafted with care, delivered with love.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Decorative Bottom Border -->
                                <tr>
                                    <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        // Send customer email
        const customerEmailSent = await sendOrderMail(user.email, customerSubject, '', customerHtml);

        // === ADMIN EMAIL ===
        let adminEmailSent = false;
        if (owner && owner.email) {
            const adminSubject = `New Order Alert #${orderId.toString().slice(-6)} – Aarovi Admin`;

            const adminHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Order Alert - Aarovi Admin</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                    </style>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #FCFAFA 0%, #ffffff 100%); color: #131010;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #FCFAFA 0%, #EBD9D1 100%); min-height: 100vh;">
                        <tr>
                            <td align="center" style="padding: 60px 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 10px 40px rgba(79, 32, 13, 0.12); border-radius: 4px; overflow: hidden;">
                                    
                                    <!-- Alert Bar -->
                                    <tr>
                                        <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                                    </tr>

                                    <tr>
                                        <td style="background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); padding: 18px 32px; text-align: center;">
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #ffffff; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">New Order Received</p>
                                        </td>
                                    </tr>

                                    <!-- Header -->
                                    <tr>
                                        <td style="padding: 50px 50px 40px; text-align: center; background: #ffffff; border-bottom: 2px solid #EBD9D1;">
                                            <h1 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 48px; font-weight: 600; letter-spacing: 4px; color: #4F200D; text-transform: uppercase;">AAROVI</h1>
                                            <div style="width: 60px; height: 2px; background: #4F200D; margin: 0 auto 16px;"></div>
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; color: #131010; text-transform: uppercase; font-weight: 600; opacity: 0.7;">Admin Dashboard</p>
                                        </td>
                                    </tr>

                                    <!-- Greeting -->
                                    <tr>
                                        <td style="padding: 50px 50px 40px; text-align: center; background: #FCFAFA;">
                                            <h2 style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 600; letter-spacing: 1px; color: #4F200D;">New Order Placed</h2>
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.8; opacity: 0.85;">Hello <strong style="font-weight: 700; color: #4F200D;">${owner.name}</strong>, a customer has placed an order that requires your attention and processing.</p>
                                        </td>
                                    </tr>

                                    <!-- Order Overview Card -->
                                    <tr>
                                        <td style="padding: 0 50px 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #ffffff; border-radius: 12px; overflow: hidden;">
                                                <tr>
                                                    <td style="padding: 28px 32px; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-bottom: 2px solid #EBD9D1;">
                                                        <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #ffffff;">Order Information</h3>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 32px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order ID</td>
                                                                <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 700; text-align: right; letter-spacing: 0.5px;">#${orderId}</td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #EBD9D1;">
                                                                <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order Date</td>
                                                                <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 600; text-align: right;">${formatDate(date)}</td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #EBD9D1;">
                                                                <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Payment Status</td>
                                                                <td style="padding: 14px 0; text-align: right;">${getPaymentBadge(paymentMethod, payment)}</td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #EBD9D1;">
                                                                <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; opacity: 0.7;">Order Value</td>
                                                                <td style="padding: 14px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; color: #4F200D; font-weight: 600; text-align: right; letter-spacing: 0.5px;">₹${amount.toLocaleString('en-IN')}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Customer Details -->
                                    <tr>
                                        <td style="padding: 0 50px 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #FCFAFA; border-radius: 12px; overflow: hidden;">
                                                <tr>
                                                    <td style="padding: 24px 32px; border-bottom: 1px solid #EBD9D1;">
                                                        <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #4F200D;">Customer Details</h3>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 28px 32px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="padding: 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; opacity: 0.7; width: 35%;">Name</td>
                                                                <td style="padding: 10px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #4F200D; font-weight: 600;">${user.name}</td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #EBD9D1;">
                                                                <td style="padding: 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; opacity: 0.7;">Email</td>
                                                                <td style="padding: 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #4F200D;"><a href="mailto:${user.email}" style="color: #4F200D; text-decoration: none; border-bottom: 1px solid #EBD9D1;">${user.email}</a></td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #EBD9D1;">
                                                                <td style="padding: 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; opacity: 0.7;">Phone</td>
                                                                <td style="padding: 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #4F200D;">${address.phone || 'N/A'}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Items to Process -->
                                    <tr>
                                        <td style="padding: 0 50px 40px;">
                                            <h3 style="margin: 0 0 20px 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #4F200D;">Items to Process</h3>
                                            ${items.map((item, index) => `
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${index < items.length - 1 ? '16px' : '0'}; border: 2px solid #EBD9D1; background: #FCFAFA; border-radius: 8px;">
                                                    <tr>
                                                        <td style="padding: 24px;">
                                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                                <tr>
                                                                    <td style="width: 65%; vertical-align: top;">
                                                                        <img 
                                                                            src="${item.image}" 
                                                                            alt="${item.name}" 
                                                                            style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; margin-bottom: 10px; display: block;"
                                                                        />
                                                                        <h4 style="margin: 0 0 8px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 600; color: #4F200D; letter-spacing: 0.5px;">
                                                                            ${item.name || 'Product'}
                                                                        </h4>
                                                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; line-height: 1.7; opacity: 0.7;">
                                                                            Qty: ${item.quantity}
                                                                            ${item.size ? ` · Size: ${item.size}` : ''}
                                                                        </p>
                                                                    </td>
                                                                    <td style="width: 35%; text-align: right; vertical-align: top;">
                                                                        <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 20px; color: #4F200D; font-weight: 600; letter-spacing: 0.5px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            `).join('')}
                                        </td>
                                    </tr>

                                    <!-- Shipping Address -->
                                    <tr>
                                        <td style="padding: 0 50px 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #FEF3C7; border-left: 6px solid #D97706; border-radius: 12px;">
                                                <tr>
                                                    <td style="padding: 24px 32px; border-bottom: 1px solid #F59E0B;">
                                                        <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #92400E;">Shipping Address</h3>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 28px 32px;">
                                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #78350F; font-weight: 500; line-height: 1.9;">
                                                            <strong style="font-weight: 700; color: #92400E;">${address.firstName || ''} ${address.lastName || ''}</strong><br>
                                                            ${address.street || ''}<br>
                                                            ${address.city || ''}, ${address.state || ''} ${address.zipcode || ''}<br>
                                                            ${address.country || ''}<br>
                                                            <span style="color: #78350F; margin-top: 8px; display: inline-block;">Phone: ${address.phone || 'N/A'}</span>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Action Required Banner -->
                                    <tr>
                                        <td style="padding: 0 50px 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-radius: 12px;">
                                                <tr>
                                                    <td style="padding: 28px 32px; text-align: center;">
                                                        <h3 style="margin: 0 0 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">Action Required</h3>
                                                        <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 400; line-height: 1.8;">
                                                            Please process this order promptly and update the status in your admin panel.<br>
                                                            ${paymentMethod === 'COD' ? '<strong style="font-weight: 700; color: #ffffff;">Cash on Delivery</strong> – Customer will pay upon delivery.' : '<strong style="font-weight: 700; color: #ffffff;">Payment Confirmed</strong> – Online payment received successfully.'}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 40px 50px; text-align: center; background: linear-gradient(135deg, #FCFAFA, #EBD9D1); border-top: 2px solid #EBD9D1;">
                                            <p style="margin: 0 0 12px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                                Manage this order in your Admin Dashboard
                                            </p>
                                            <div style="margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #EBD9D1;">
                                                <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #131010; font-weight: 400; opacity: 0.5; line-height: 1.6;">
                                                    © ${new Date().getFullYear()} Aarovi Admin Panel<br>
                                                    This email was sent to ${owner.email}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `;

            adminEmailSent = await sendOrderMail(owner.email, adminSubject, '', adminHtml);
        }

        return customerEmailSent;

    } catch (error) {
        console.error('Error in sendOrderEmails:', error);
        return false;
    }
};

export { sendOrderMail, sendOrderEmails, sendShippingEmail, sendDeliveredEmail };
export default sendOrderEmails;