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

const sendOtpMail = async (email, otp, role = 'user') => {
  if (!email || !otp) {
    console.error('Missing email or OTP for verification mail');
    return false;
  }

  const isAdmin = role === 'admin';
  const portalType = isAdmin ? 'Admin Portal' : 'Customer Account';
  const registrationType = isAdmin ? 'admin registration' : 'account registration';

  const mailOptions = {
    from: `"Aarovi" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${isAdmin ? 'Admin ' : ''}Verification Code – Aarovi`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - Aarovi</title>
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
                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; color: #131010; text-transform: uppercase; font-weight: 600; opacity: 0.7;">${portalType}</p>
                              </td>
                          </tr>

                          ${isAdmin ? `
                          <!-- Admin Alert Banner -->
                          <tr>
                              <td style="background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); padding: 18px 32px; text-align: center;">
                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #ffffff; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">🔐 Admin Access Verification</p>
                              </td>
                          </tr>
                          ` : ''}

                          <!-- Main Content -->
                          <tr>
                              <td style="padding: 50px 50px 40px; text-align: center; background: #FCFAFA;">
                                  <div style="display: inline-block; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); color: #ffffff; padding: 10px 24px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(79, 32, 13, 0.25);">✉️ Email Verification</div>
                                  <h2 style="margin: 0 0 20px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 600; letter-spacing: 1px; color: #4F200D; line-height: 1.2;">Verify Your Email</h2>
                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #131010; font-weight: 400; line-height: 1.8; max-width: 460px; margin: 0 auto; opacity: 0.85;">
                                      We've sent you a verification code to complete your ${registrationType}. Please enter the code below to verify your email address and activate your account.
                                  </p>
                              </td>
                          </tr>

                          <!-- OTP Display Card -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #EBD9D1 0%, #FCFAFA 100%); border: 3px dashed #4F200D; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 44px 32px; text-align: center;">
                                              <p style="margin: 0 0 24px 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #4F200D; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">Your Verification Code</p>
                                              
                                              <!-- OTP Code -->
                                              <div style="font-family: 'Courier New', Courier, monospace; font-size: 48px; font-weight: 700; color: #4F200D; letter-spacing: 14px; margin: 0 0 24px 0; text-shadow: 0 2px 12px rgba(79, 32, 13, 0.15);">
                                                  ${otp}
                                              </div>
                                              
                                              <div style="display: inline-block; background: #ffffff; border: 2px solid #EBD9D1; border-radius: 8px; padding: 12px 24px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                                                  <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 500;">
                                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                                                          <circle cx="12" cy="12" r="10" stroke="#4F200D" stroke-width="2"/>
                                                          <path d="M12 6V12L16 14" stroke="#4F200D" stroke-width="2" stroke-linecap="round"/>
                                                      </svg>
                                                      Expires in <strong style="color: #4F200D; font-weight: 700;">5 minutes</strong>
                                                  </p>
                                              </div>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Instructions -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #EBD9D1; background: #ffffff; border-radius: 12px; overflow: hidden;">
                                      <tr>
                                          <td style="padding: 28px 32px; background: linear-gradient(135deg, #4F200D 0%, #6B2D10 100%); border-bottom: 2px solid #EBD9D1;">
                                              <h3 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #ffffff;">📝 Next Steps</h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 32px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.8;">
                                                          <strong style="color: #4F200D; font-weight: 700; font-size: 16px; margin-right: 8px;">1.</strong> Return to the ${isAdmin ? 'admin ' : ''}registration page
                                                      </td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #EBD9D1;">
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.8;">
                                                          <strong style="color: #4F200D; font-weight: 700; font-size: 16px; margin-right: 8px;">2.</strong> Enter the 6-digit code shown above
                                                      </td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #EBD9D1;">
                                                      <td style="padding: 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.8;">
                                                          <strong style="color: #4F200D; font-weight: 700; font-size: 16px; margin-right: 8px;">3.</strong> Click "Verify & Create Account" to complete
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          ${isAdmin ? `
                          <!-- Admin Notice -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%); border: 2px solid #EF4444; border-left: 6px solid #DC2626; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 28px 32px;">
                                              <h4 style="margin: 0 0 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px; color: #991B1B; text-transform: uppercase;">⚠️ Admin Access Notice</h4>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #7F1D1D; font-weight: 500; line-height: 1.7;">
                                                  This verification is for administrative access to the Aarovi platform. Only authorized personnel should complete this verification process. Unauthorized access attempts will be logged and reported.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          ` : ''}

                          <!-- Security Notice -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border: 2px solid #F59E0B; border-left: 6px solid #D97706; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 28px 32px;">
                                              <h4 style="margin: 0 0 18px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px; color: #92400E; text-transform: uppercase;">🛡️ Security Guidelines</h4>
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding: 8px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #78350F; font-weight: 500; line-height: 1.7;">
                                                          <span style="display: inline-block; width: 6px; height: 6px; background: #D97706; border-radius: 50%; margin-right: 10px; vertical-align: middle;"></span> Never share this code with anyone
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="padding: 8px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #78350F; font-weight: 500; line-height: 1.7;">
                                                          <span style="display: inline-block; width: 6px; height: 6px; background: #D97706; border-radius: 50%; margin-right: 10px; vertical-align: middle;"></span> Aarovi team will never ask for your verification code
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="padding: 8px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #78350F; font-weight: 500; line-height: 1.7;">
                                                          <span style="display: inline-block; width: 6px; height: 6px; background: #D97706; border-radius: 50%; margin-right: 10px; vertical-align: middle;"></span> This code is valid for 5 minutes only
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="padding: 8px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #78350F; font-weight: 500; line-height: 1.7;">
                                                          <span style="display: inline-block; width: 6px; height: 6px; background: #D97706; border-radius: 50%; margin-right: 10px; vertical-align: middle;"></span> If you didn't request this, please ignore this email
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Help Section -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #FCFAFA; border: 2px solid #EBD9D1; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 32px; text-align: center;">
                                              <h4 style="margin: 0 0 14px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; color: #4F200D;">Having trouble verifying?</h4>
                                              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #131010; font-weight: 400; line-height: 1.8; opacity: 0.85;">
                                                  Make sure you're entering the code exactly as shown • Check if the code has expired • Try requesting a new verification code • Contact our support team if the issue persists
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Contact Information -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%); border: 2px solid #38BDF8; border-radius: 12px;">
                                      <tr>
                                          <td style="padding: 28px 32px; text-align: center;">
                                              <h4 style="margin: 0 0 14px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; color: #075985; text-transform: uppercase; letter-spacing: 1px;">💬 Need Help?</h4>
                                              <p style="margin: 0 0 20px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #0C4A6E; font-weight: 400; line-height: 1.7;">
                                                  Our support team is available to assist you
                                              </p>
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="width: 50%; padding: 10px; text-align: center;">
                                                          <div style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #0C4A6E; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">📧 Email</div>
                                                          <a href="mailto:aaroiviofficial@gmail.com" style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #075985; text-decoration: none; font-weight: 600; border-bottom: 2px solid #38BDF8;">aaroiviofficial@gmail.com</a>
                                                      </td>
                                                      <td style="width: 50%; padding: 10px; text-align: center;">
                                                          <div style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: #0C4A6E; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">📞 Phone</div>
                                                          <a href="tel:+919399336666" style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #075985; text-decoration: none; font-weight: 600; border-bottom: 2px solid #38BDF8;">+91 9399336666</a>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td colspan="2" style="padding-top: 12px; text-align: center;">
                                                          <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #0C4A6E; font-weight: 400;">Mon–Sat: 9 AM – 6 PM IST</p>
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
                              <td style="padding: 40px 50px; text-align: center; background: linear-gradient(135deg, #FCFAFA 0%, #EBD9D1 100%); border-top: 2px solid #EBD9D1;">
                                  <p style="margin: 0 0 10px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                      This is an automated verification email sent to <a href="mailto:${email}" style="color: #4F200D; text-decoration: none; font-weight: 600; border-bottom: 1px solid #EBD9D1;">${email}</a>
                                  </p>
                                  <p style="margin: 0 0 24px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #131010; font-weight: 400; opacity: 0.7;">
                                      For assistance, contact us at <a href="mailto:aaroiviofficial@gmail.com" style="color: #4F200D; text-decoration: none; font-weight: 600; border-bottom: 1px solid #EBD9D1;">aaroiviofficial@gmail.com</a>
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
    console.log(`OTP email sent successfully for ${role} registration to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error.message);
    return false;
  }
};

export default sendOtpMail;