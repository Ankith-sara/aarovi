import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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

const sendNewsletterMail = async (email) => {
  if (!email) {
    console.error('Missing email for newsletter subscription');
    return false;
  }

  const mailOptions = {
    from: `"Aarovi" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank You for Subscribing to Aarovi',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Aarovi Newsletter</title>
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

                          <!-- Header -->
                          <tr>
                              <td style="padding: 50px 50px 40px; text-align: center; background: #ffffff; border-bottom: 2px solid #EBD9D1;">
                                  <h1 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 48px; font-weight: 600; letter-spacing: 4px; color: #4F200D; text-transform: uppercase;">AAROVI</h1>
                                  <div style="width: 60px; height: 2px; background: #4F200D; margin: 0 auto 16px;"></div>
                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; color: #131010; text-transform: uppercase; font-weight: 600; opacity: 0.7;">Handcrafted Heritage · Timeless Elegance</p>
                              </td>
                          </tr>

                          <!-- Welcome Hero -->
                          <tr>
                              <td style="padding: 50px 50px 40px; text-align: center; background: #FCFAFA;">
                                  <div style="display: inline-block; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); color: #ffffff; padding: 10px 24px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(79, 32, 13, 0.25);">Newsletter Subscription</div>
                                  <h2 style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 600; letter-spacing: 1px; color: #4F200D; line-height: 1.2;">Thank You for Subscribing</h2>
                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.8; max-width: 460px; margin: 0 auto; opacity: 0.85;">
                                      We're honored to welcome you to the Aarovi family. You're now part of a community that celebrates India's rich handcrafted heritage and timeless elegance.
                                  </p>
                              </td>
                          </tr>

                          <!-- About Aarovi -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #ffffff; border-radius: 12px; overflow: hidden;">
                                      <tr>
                                          <td style="padding: 28px 32px; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-bottom: 2px solid #EBD9D1;">
                                              <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #ffffff;">About Aarovi</h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 32px;">
                                              <p style="margin: 0 0 18px 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.9; opacity: 0.85;">
                                                  Aarovi is a celebration of India's artisanal excellence and cultural legacy. We bring you handcrafted fashion that honors traditional craftsmanship while embracing contemporary elegance.
                                              </p>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.9; opacity: 0.85;">
                                                  Each piece in our collection tells a story of skilled artisans, time-honored techniques, and the timeless beauty of handmade creations. We are committed to preserving India's textile heritage while creating sustainable, meaningful fashion for the modern world.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- What You'll Receive -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <h3 style="margin: 0 0 20px 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #4F200D;">What You'll Receive</h3>
                                  
                                  <!-- Benefit 1 -->
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; background: #FCFAFA; border: 2px solid #EBD9D1; border-left: 6px solid #4F200D; border-radius: 8px;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <h4 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #4F200D; letter-spacing: 0.5px;">Exclusive Collection Launches</h4>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.8; opacity: 0.85;">
                                                  Be the first to discover our new handcrafted collections and limited-edition pieces before anyone else.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>

                                  <!-- Benefit 2 -->
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; background: #FCFAFA; border: 2px solid #EBD9D1; border-left: 6px solid #4F200D; border-radius: 8px;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <h4 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #4F200D; letter-spacing: 0.5px;">Artisan Stories & Craftsmanship</h4>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.8; opacity: 0.85;">
                                                  Behind-the-scenes insights into the artisans, their techniques, and the heritage of Indian handcrafted fashion.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>

                                  <!-- Benefit 3 -->
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; background: #FCFAFA; border: 2px solid #EBD9D1; border-left: 6px solid #4F200D; border-radius: 8px;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <h4 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #4F200D; letter-spacing: 0.5px;">Style Inspiration & Trends</h4>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.8; opacity: 0.85;">
                                                  Curated fashion tips, styling guides, and the latest trends in ethnic and contemporary wear.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>

                                  <!-- Benefit 4 -->
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FCFAFA; border: 2px solid #EBD9D1; border-left: 6px solid #4F200D; border-radius: 8px;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <h4 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #4F200D; letter-spacing: 0.5px;">Exclusive Subscriber Benefits</h4>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.8; opacity: 0.85;">
                                                  Special offers, early-bird discounts, and subscriber-only access to seasonal sales and events.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Stay Connected -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); border: 2px solid #F59E0B; border-left: 6px solid #D97706; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 28px 32px; text-align: center;">
                                              <h4 style="margin: 0 0 14px 0; font-family: 'Bodoni Moda', serif; font-size: 22px; font-weight: 600; color: #92400E;">Stay Connected</h4>
                                              <p style="margin: 0 0 20px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #78350F; font-weight: 500; line-height: 1.8;">
                                                  Follow us on social media for daily inspiration, behind-the-scenes content, and to be part of our growing community.
                                              </p>
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td align="center">
                                                          <a href="https://www.instagram.com/aarovi.in/" style="display: inline-block; margin: 0 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #78350F; text-decoration: none; font-weight: 600; border-bottom: 2px solid #F59E0B; padding-bottom: 2px;">
                                                              Instagram
                                                          </a>
                                                          <a href="https://www.facebook.com/aarovi.in/" style="display: inline-block; margin: 0 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #78350F; text-decoration: none; font-weight: 600; border-bottom: 2px solid #F59E0B; padding-bottom: 2px;">
                                                              Facebook
                                                          </a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Closing Quote -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%); border: 2px solid #38BDF8; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 32px 36px; text-align: center;">
                                              <p style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; color: #075985; font-weight: 600; line-height: 1.7; letter-spacing: 0.5px;">
                                                  "Every thread tells a story, every design preserves a tradition. Thank you for choosing to celebrate India's handcrafted heritage with us."
                                              </p>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #0C4A6E; font-weight: 600; letter-spacing: 0.5px;">
                                                  — The Aarovi Team
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Contact Information -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FCFAFA; border: 2px solid #EBD9D1; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 28px 32px; text-align: center;">
                                              <h4 style="margin: 0 0 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; color: #4F200D; text-transform: uppercase; letter-spacing: 1px;">Need Assistance?</h4>
                                              <p style="margin: 0 0 16px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.7; opacity: 0.85;">
                                                  Our team is here to help you with any questions or support you may need.
                                              </p>
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="width: 50%; padding: 10px; text-align: center;">
                                                          <div style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #131010; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7;">Email</div>
                                                          <a href="mailto:aaroviofficial@gmail.com" style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #4F200D; text-decoration: none; font-weight: 600; border-bottom: 2px solid #EBD9D1;">aaroviofficial@gmail.com</a>
                                                      </td>
                                                      <td style="width: 50%; padding: 10px; text-align: center;">
                                                          <div style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #131010; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7;">Phone</div>
                                                          <a href="tel:+919399336666" style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #4F200D; text-decoration: none; font-weight: 600; border-bottom: 2px solid #EBD9D1;">+91 9399336666</a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                              <td style="padding: 40px 50px; text-align: center; background: linear-gradient(135deg, #FCFAFA, #EBD9D1); border-top: 2px solid #EBD9D1;">
                                  <p style="margin: 0 0 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                      You're receiving this email because you subscribed to the Aarovi newsletter at <a href="mailto:${email}" style="color: #4F200D; text-decoration: none; font-weight: 600; border-bottom: 1px solid #EBD9D1;">${email}</a>
                                  </p>
                                  <p style="margin: 0 0 20px 0; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #131010; font-weight: 400; opacity: 0.7;">
                                      <a href="#" style="color: #131010; text-decoration: none; opacity: 0.7; font-weight: 400;">Unsubscribe</a> · 
                                      <a href="#" style="color: #131010; text-decoration: none; opacity: 0.7; font-weight: 400;">Privacy Policy</a>
                                  </p>
                                  
                                  <div style="margin: 0; padding-top: 24px; border-top: 1px solid #EBD9D1;">
                                      <p style="margin: 0 0 12px 0; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #131010; font-weight: 500; opacity: 0.6; line-height: 1.6;">
                                          <strong style="font-weight: 600;">AAROVI FASHIONS</strong><br>
                                          Hyderabad, Telangana - 502345, India
                                      </p>
                                      <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #131010; font-weight: 400; opacity: 0.5; line-height: 1.6;">
                                          © ${new Date().getFullYear()} Aarovi. All rights reserved.<br>
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Newsletter welcome email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send newsletter email:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export default sendNewsletterMail;