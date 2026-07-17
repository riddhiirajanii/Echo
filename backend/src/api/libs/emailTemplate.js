/**
 * Generates a clean, calming HTML email template for verification codes.
 * @param {string} verificationCode - The 6-digit verification token.
 * @returns {string} HTML Email Content
 */
export const generateVerificationEmail = (verificationCode) => {
  const nameGreeting = "Hello,";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
        /* Reset and Base Styles */
        body, p, h1, h2 {
          margin: 0;
          padding: 0;
        }
        body {
          background-color: #fffdfd;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #3d3332;
          line-height: 1.6;
        }
        .email-wrapper {
          width: 100%;
          background-color: #fffdfd;
          padding: 40px 0;
        }
        .email-container {
          max-width: 560px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid rgba(255, 228, 230, 0.8);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 12px 40px rgba(251, 113, 133, 0.03);
        }
        .email-header {
          margin-bottom: 24px;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 800;
          color: #9f1239;
        }
        .email-text {
          font-size: 16px;
          color: #614e4e;
          margin-bottom: 32px;
        }
        /* Verification Box Code Layout */
        .code-container {
          background-color: #fff1f2;
          border: 1px dashed #fda4af;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          margin-bottom: 32px;
        }
        .verification-code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 6px;
          color: #fb7185;
          display: inline-block;
        }
        .email-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #fff1f2;
          font-size: 13px;
          color: #bfaeae;
          text-align: center;
        }
        .footer-note {
          margin-top: 8px;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          
          <!-- Heading Area -->
          <h1 class="email-header">Your Wellness Space Awaits 🌱</h1>
          
          <!-- Narrative Greeting -->
          <p class="email-text">
            ${nameGreeting}<br><br>
            Thank you for taking a step inward with us. To secure your sanctuary and verify your email address, please use the verification code below:
          </p>
          
          <!-- Secure Code Display Card -->
          <div class="code-container">
            <span class="verification-code">${verificationCode}</span>
          </div>
          
          <p class="email-text">
            This verification token is valid for the next 15 minutes. If you did not request this code, you can safely disregard this message.
          </p>
          
          <!-- Footer Disclaimers -->
          <div class="email-footer">
            <p>Sent with care from your personal wellness companion workspace.</p>
            <p class="footer-note">Keeping your reflection history and thoughts safe.</p>
          </div>
          
        </div>
      </div>
    </body>
    </html>
  `;
};

// Example Usage with Node Mailer / SendGrid / etc:
// const htmlBody = generateVerificationEmail("Alex", "482019");
