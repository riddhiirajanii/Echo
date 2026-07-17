import nodemailer from 'nodemailer';

// Create a transporter using SMTP
 export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "riddhiirajanii@gmail.com",
    pass: "aqvx ukov xnsq eiti",
  },
});

const sendEmail = async () => {
  try{
    const response = await transporter.sendMail({
    from: '"ECHO" <riddhiirajanii@gmail.com>', // sender address
    to: "riddhiirajanii@gmail.com", // list of recipients
    subject: "Verify your email", // subject line
    text: "Verification Code", // plain text body
    html: "<b>Your verification code is: ${verificationCode}</b>", // HTML body
  });

  console.log("Message sent", response);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(response));
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

