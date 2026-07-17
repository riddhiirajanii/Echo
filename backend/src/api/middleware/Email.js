import { transporter } from "./Email.config.js";
import { generateVerificationEmail } from "../libs/emailTemplate.js";

export const SendVerificationCode = async (email, verificationCode) => {
  try {
     const response = await transporter.sendMail({
    from: '"ECHO" <riddhiirajanii@gmail.com>', // sender address
    to: email, // list of recipients
    subject: "Verify your email", // subject line
    text: `Your verification code is: ${verificationCode}`, // plain text body
    html: generateVerificationEmail(verificationCode), // HTML body
  });

  console.log("Message sent", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default SendVerificationCode;