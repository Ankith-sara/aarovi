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

  const whatsappLink = process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK';

  const mailOptions = {
    from: `"Aharyas" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✨ Welcome to the Aharyas Community!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Aharyas</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 3px;">AHARYAS</h1>
                  <p style="color: rgba(255,255,255,0.95); margin: 12px 0 0 0; font-size: 15px; letter-spacing: 1px;">HANDCRAFTED WITH HERITAGE</p>
              </div>

              <!-- Main Content -->
              <div style="padding: 40px 30px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
                  
                  <h2 style="color: #333; margin: 0 0 15px 0; font-size: 26px; font-weight: 400;">Welcome to Our Community!</h2>
                  
                  <p style="color: #666; margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                      Thank you for joining the Aharyas family! We're thrilled to have you as part of our community 
                      that celebrates heritage, sustainability, and conscious fashion.
                  </p>

                  <!-- WhatsApp CTA -->
                  <div style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); border-radius: 12px; padding: 35px 25px; margin: 30px 0; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                      <div style="font-size: 42px; margin-bottom: 15px;">💬</div>
                      <h3 style="color: white; margin: 0 0 12px 0; font-size: 22px;">Join Our WhatsApp Community</h3>
                      <p style="color: rgba(255,255,255,0.95); margin: 0 0 25px 0; font-size: 15px; line-height: 1.5;">
                          Get exclusive updates, early access to collections, and connect with fellow fashion enthusiasts!
                      </p>
                      <a href="${whatsappLink}" 
                         style="display: inline-block; background: white; color: #128C7E; padding: 15px 40px; 
                                text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; 
                                box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
                          Join WhatsApp Group →
                      </a>
                  </div>

                  <!-- Benefits Grid -->
                  <div style="margin: 35px 0;">
                      <h3 style="color: #333; margin: 0 0 25px 0; font-size: 20px; font-weight: 400;">What You'll Receive:</h3>
                      
                      <div style="text-align: left; margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #8B4513;">
                          <div style="font-size: 24px; margin-bottom: 8px;">✨</div>
                          <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: 600;">Exclusive Drops</h4>
                          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                              Be the first to know about new collections and limited-edition pieces
                          </p>
                      </div>

                      <div style="text-align: left; margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #D2B48C;">
                          <div style="font-size: 24px; margin-bottom: 8px;">🎨</div>
                          <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: 600;">Artisan Stories</h4>
                          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                              Behind-the-scenes glimpses into our makers' craftsmanship and heritage
                          </p>
                      </div>

                      <div style="text-align: left; margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #8B4513;">
                          <div style="font-size: 24px; margin-bottom: 8px;">🌿</div>
                          <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: 600;">Sustainability Updates</h4>
                          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                              Learn about our eco-friendly practices and community impact initiatives
                          </p>
                      </div>

                      <div style="text-align: left; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #D2B48C;">
                          <div style="font-size: 24px; margin-bottom: 8px;">🎁</div>
                          <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: 600;">Special Offers</h4>
                          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                              Subscriber-only discounts and early-bird pricing on new launches
                          </p>
                      </div>
                  </div>

                  <!-- Divider -->
                  <div style="height: 1px; background: #e0e0e0; margin: 35px 0;"></div>

                  <!-- Social Media -->
                  <div style="margin: 30px 0;">
                      <p style="color: #666; margin: 0 0 15px 0; font-size: 15px;">Follow us on social media:</p>
                      <div>
                          <a href="https://instagram.com/aharyas" style="display: inline-block; margin: 0 10px; text-decoration: none; color: #E4405F; font-size: 14px;">
                              📷 Instagram
                          </a>
                          <a href="https://facebook.com/aharyas" style="display: inline-block; margin: 0 10px; text-decoration: none; color: #1877F2; font-size: 14px;">
                              📘 Facebook
                          </a>
                          <a href="https://twitter.com/aharyas" style="display: inline-block; margin: 0 10px; text-decoration: none; color: #1DA1F2; font-size: 14px;">
                              🐦 Twitter
                          </a>
                      </div>
                  </div>

                  <!-- Thank You Message -->
                  <div style="background: #fff8e1; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #ffb74d;">
                      <p style="color: #666; margin: 0; font-size: 15px; line-height: 1.6; font-style: italic;">
                          "Every piece tells a story, every thread connects us to our heritage. 
                          Thank you for being part of our journey towards sustainable and meaningful fashion."
                      </p>
                      <p style="color: #999; margin: 10px 0 0 0; font-size: 13px;">
                          — The Aharyas Team
                      </p>
                  </div>
              </div>

              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #eee;">
                  <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                      You're receiving this because you subscribed to Aharyas newsletter
                  </p>
                  <p style="margin: 0 0 15px 0; color: #999; font-size: 12px;">
                      Questions? Contact us at <a href="mailto:support@aharyas.com" style="color: #8B4513; text-decoration: none;">support@aharyas.com</a>
                  </p>
                  <p style="margin: 0; color: #999; font-size: 11px;">
                      <a href="#" style="color: #999; text-decoration: none;">Unsubscribe</a> | 
                      <a href="#" style="color: #999; text-decoration: none;">Privacy Policy</a>
                  </p>
              </div>
          </div>
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