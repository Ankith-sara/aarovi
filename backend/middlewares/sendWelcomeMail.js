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

// Helper function to format current date
const formatDate = () => {
  return new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const sendWelcomeMail = async (email, name = 'Admin') => {
  if (!email) {
    console.error('Missing email for welcome mail');
    return false;
  }

  const mailOptions = {
    from: `"Aarovi" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Aarovi, ${name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Aarovi</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #FCFAFA 0%, #ffffff 100%); color: #131010;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #FCFAFA 0%, #EBD9D1 100%); min-height: 100vh;">
              <tr>
                  <td align="center" style="padding: 60px 20px;">
                      <table cellpadding="0" cellspacing="0" border="0" width="680" style="max-width: 680px; background-color: #ffffff; box-shadow: 0 10px 40px rgba(79, 32, 13, 0.12); border-radius: 4px; overflow: hidden;">
                          
                          <!-- Decorative Top Border -->
                          <tr>
                              <td style="height: 8px; background: linear-gradient(90deg, #4F200D 0%, #8B4513 50%, #4F200D 100%);"></td>
                          </tr>

                          <!-- Header with Background Pattern -->
                          <tr>
                              <td style="padding: 60px 60px 50px; text-align: center; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); position: relative;">
                                  <h1 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 56px; font-weight: 600; letter-spacing: 4px; color: #ffffff; text-transform: uppercase; position: relative; z-index: 1;">AAROVI</h1>
                                  <div style="width: 60px; height: 2px; background: #EBD9D1; margin: 0 auto 16px; position: relative; z-index: 1;"></div>
                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 3px; color: rgba(252, 250, 250, 0.95); text-transform: uppercase; font-weight: 500; position: relative; z-index: 1;">Handcrafted & Custom-Made Fashion</p>
                              </td>
                          </tr>

                          <!-- Hero Welcome Section -->
                          <tr>
                              <td style="padding: 0; background: #FCFAFA;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                      <tr>
                                          <td style="padding: 50px 60px 40px; text-align: center;">
                                              <div style="display: inline-block; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); color: #ffffff; padding: 10px 24px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px;">✨ Admin Account Created</div>
                                              <h2 style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 42px; font-weight: 600; letter-spacing: 1px; color: #4F200D; line-height: 1.2;">Welcome to Aarovi</h2>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 16px; color: #131010; font-weight: 400; line-height: 1.8; max-width: 500px; margin: 0 auto; opacity: 0.85;">Your admin account has been successfully created. We're thrilled to have you join the Aarovi management team.</p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Personal Greeting Card -->
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #EBD9D1 0%, #FCFAFA 100%); border-radius: 12px; border: 1px solid #E8DCC4;">
                                      <tr>
                                          <td style="padding: 40px; text-align: center;">
                                              <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 500; letter-spacing: 1px; color: #4F200D;">Hello, ${name}</h3>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.8; max-width: 480px; margin: 0 auto; opacity: 0.85;">
                                                  Thank you for joining <strong style="font-weight: 600; color: #4F200D;">Aarovi Fashions</strong>. Together, we'll continue creating beautiful handcrafted and custom-made fashion that celebrates artisanal craftsmanship.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Account Details Card -->}
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #ffffff; border-radius: 12px; overflow: hidden;">
                                      <tr>
                                          <td style="padding: 28px 36px; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-bottom: 2px solid #EBD9D1;">
                                              <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #ffffff;">📋 Your Account Information</h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 36px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; width: 40%; opacity: 0.7;">Admin Name</td>
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #4F200D; font-weight: 600;">${name}</td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #EBD9D1;">
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; opacity: 0.7;">Email Address</td>
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 500;">${email}</td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #EBD9D1;">
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; opacity: 0.7;">Account Type</td>
                                                      <td style="padding: 14px 0;">
                                                          <span style="display: inline-block; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); color: #ffffff; padding: 8px 20px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 6px; box-shadow: 0 2px 8px rgba(79, 32, 13, 0.2);">Administrator</span>
                                                      </td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #EBD9D1;">
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; opacity: 0.7;">Registration Date</td>
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 500;">${formatDate()}</td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #EBD9D1;">
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; opacity: 0.7;">Location</td>
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 500;">Hyderabad, Telangana, India</td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Quick Start Guide -->}
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FCFAFA; border: 2px solid #EBD9D1; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 36px 40px;">
                                              <h3 style="margin: 0 0 28px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; color: #4F200D; text-align: center;">🚀 Getting Started Guide</h3>
                                              
                                              <!-- Step 1 -->
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                                                  <tr>
                                                      <td style="width: 50px; vertical-align: top;">
                                                          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(79, 32, 13, 0.25);">
                                                              <span style="font-family: 'DM Sans', sans-serif; color: #ffffff; font-weight: 700; font-size: 16px; line-height: 40px; text-align: center; display: block;">1</span>
                                                          </div>
                                                      </td>
                                                      <td style="padding-left: 20px;">
                                                          <h4 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #4F200D;">Access Your Dashboard</h4>
                                                          <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.7; opacity: 0.85;">Log in to your admin panel to start managing products, orders, and customers with our intuitive interface.</p>
                                                      </td>
                                                  </tr>
                                              </table>

                                              <!-- Step 2 -->
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                                                  <tr>
                                                      <td style="width: 50px; vertical-align: top;">
                                                          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(79, 32, 13, 0.25);">
                                                              <span style="font-family: 'DM Sans', sans-serif; color: #ffffff; font-weight: 700; font-size: 16px; line-height: 40px; text-align: center; display: block;">2</span>
                                                          </div>
                                                      </td>
                                                      <td style="padding-left: 20px;">
                                                          <h4 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #4F200D;">Complete Your Profile</h4>
                                                          <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.7; opacity: 0.85;">Set up your admin profile and configure preferences to personalize your workflow and experience.</p>
                                                      </td>
                                                  </tr>
                                              </table>

                                              <!-- Step 3 -->
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="width: 50px; vertical-align: top;">
                                                          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(79, 32, 13, 0.25);">
                                                              <span style="font-family: 'DM Sans', sans-serif; color: #ffffff; font-weight: 700; font-size: 16px; line-height: 40px; text-align: center; display: block;">3</span>
                                                          </div>
                                                      </td>
                                                      <td style="padding-left: 20px;">
                                                          <h4 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #4F200D;">Start Managing</h4>
                                                          <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.7; opacity: 0.85;">Begin adding products, processing orders, and delivering exceptional customer experiences.</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Admin Features Grid -->}
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #ffffff; border-radius: 12px; overflow: hidden;">
                                      <tr>
                                          <td style="padding: 28px 36px; background: linear-gradient(135deg, #EBD9D1 0%, #FCFAFA 100%); border-bottom: 2px solid #EBD9D1;">
                                              <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #4F200D;">⭐ Your Admin Capabilities</h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 36px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="width: 50%; padding: 12px 10px 12px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; vertical-align: middle;">
                                                          <span style="margin-right: 10px; font-size: 18px;">📦</span> Product Management
                                                      </td>
                                                      <td style="width: 50%; padding: 12px 0 12px 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; vertical-align: middle;">
                                                          <span style="margin-right: 10px; font-size: 18px;">📊</span> Sales Analytics
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 50%; padding: 12px 10px 12px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; vertical-align: middle;">
                                                          <span style="margin-right: 10px; font-size: 18px;">🛒</span> Order Processing
                                                      </td>
                                                      <td style="width: 50%; padding: 12px 0 12px 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; vertical-align: middle;">
                                                          <span style="margin-right: 10px; font-size: 18px;">👥</span> Customer Management
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 50%; padding: 12px 10px 12px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; vertical-align: middle;">
                                                          <span style="margin-right: 10px; font-size: 18px;">💰</span> Revenue Tracking
                                                      </td>
                                                      <td style="width: 50%; padding: 12px 0 12px 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; vertical-align: middle;">
                                                          <span style="margin-right: 10px; font-size: 18px;">📈</span> Performance Insights
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 50%; padding: 12px 10px 12px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; vertical-align: middle;">
                                                          <span style="margin-right: 10px; font-size: 18px;">✨</span> Custom Design Tools
                                                      </td>
                                                      <td style="width: 50%; padding: 12px 0 12px 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 500; vertical-align: middle;">
                                                          <span style="margin-right: 10px; font-size: 18px;">📧</span> Customer Support
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Important Guidelines -->}
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border: 2px solid #F59E0B; border-left: 6px solid #D97706; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 32px 36px;">
                                              <h4 style="margin: 0 0 16px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #92400E;">⚠️ Important Guidelines</h4>
                                              <ul style="margin: 0; padding-left: 20px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #78350F; font-weight: 400; line-height: 1.9;">
                                                  <li style="margin-bottom: 10px;">Maintain confidentiality of your account credentials at all times</li>
                                                  <li style="margin-bottom: 10px;">Ensure all product information and pricing are accurate before publishing</li>
                                                  <li style="margin-bottom: 10px;">Process orders within 24 hours and update customers on their order status</li>
                                                  <li style="margin-bottom: 10px;">Review our Terms & Conditions for complete operational guidelines</li>
                                                  <li>Contact support immediately if you detect any suspicious activity</li>
                                              </ul>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Support Section -->}
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%); border: 2px solid #38BDF8; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 32px 36px;">
                                              <h4 style="margin: 0 0 14px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #075985;">💬 Need Assistance?</h4>
                                              <p style="margin: 0 0 24px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0C4A6E; font-weight: 400; line-height: 1.7;">
                                                  Our dedicated support team is available to help you with any questions or technical issues.
                                              </p>
                                              <table cellpadding="0" cellspacing="0" border="0">
                                                  <tr>
                                                      <td style="padding: 0 24px 12px 0;">
                                                          <div style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: #0C4A6E; font-weight: 600; margin-bottom: 4px;">📧 Email</div>
                                                          <a href="mailto:aaroiviofficial@gmail.com" style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #075985; text-decoration: none; font-weight: 600; border-bottom: 2px solid #38BDF8;">aaroiviofficial@gmail.com</a>
                                                      </td>
                                                      <td style="padding: 0 0 12px 0;">
                                                          <div style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: #0C4A6E; font-weight: 600; margin-bottom: 4px;">📞 Phone</div>
                                                          <a href="tel:+919399336666" style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #075985; text-decoration: none; font-weight: 600; border-bottom: 2px solid #38BDF8;">+91 9399336666</a>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td colspan="2" style="padding-top: 8px;">
                                                          <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #0C4A6E; font-weight: 400;">Mon–Sat: 9 AM – 6 PM IST • Response within 24 hours</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Call to Action Button -->}
                          <tr>
                              <td style="padding: 0 60px 50px; text-align: center;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                      <tr>
                                          <td align="center">
                                              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); color: #ffffff; padding: 18px 56px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; border-radius: 8px; box-shadow: 0 8px 20px rgba(79, 32, 13, 0.3); transition: all 0.3s ease;">
                                                  Access Admin Dashboard →
                                              </a>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Closing Message -->}
                          <tr>
                              <td style="padding: 44px 60px; text-align: center; background: linear-gradient(135deg, #FCFAFA 0%, #EBD9D1 100%); border-top: 2px solid #EBD9D1;">
                                  <p style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 20px; color: #4F200D; font-weight: 600; letter-spacing: 0.5px; font-style: italic;">Welcome to the Aarovi Family</p>
                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.7; opacity: 0.85;">
                                      Together, we celebrate handcrafted excellence and custom-made fashion.
                                  </p>
                              </td>
                          </tr>

                          <!-- Terms & Legal Notice -->
                          <tr>
                              <td style="padding: 32px 60px; text-align: center; background: #ffffff; border-top: 2px solid #EBD9D1;">
                                  <div style="background: #FCFAFA; border: 1px solid #EBD9D1; border-radius: 8px; padding: 24px; margin-bottom: 28px;">
                                      <h4 style="margin: 0 0 12px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; color: #4F200D; text-transform: uppercase; letter-spacing: 1.5px;">📜 Terms & Responsibilities</h4>
                                      <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; line-height: 1.7; opacity: 0.85;">
                                          By using your admin account, you agree to maintain confidentiality, ensure accuracy in all operations, and comply with Aarovi's Terms & Conditions. All disputes fall under the jurisdiction of Hyderabad, Telangana, India.
                                      </p>
                                  </div>
                                  
                                  <p style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                      This email was sent to <a href="mailto:${email}" style="color: #4F200D; text-decoration: none; font-weight: 600; border-bottom: 1px solid #EBD9D1;">${email}</a>
                                  </p>
                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                      Questions? <a href="mailto:aaroiviofficial@gmail.com" style="color: #4F200D; text-decoration: none; font-weight: 600; border-bottom: 1px solid #EBD9D1;">Contact Support</a>
                                  </p>
                                  
                                  <div style="margin: 28px 0 0 0; padding-top: 24px; border-top: 1px solid #EBD9D1;">
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
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

export default sendWelcomeMail;