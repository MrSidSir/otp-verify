const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Mr. SidSir OTP" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code - Concept Coaching Classes",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello 👋</h2>
          <p>Here is your OTP:</p>
          <h1 style="color: #2E86DE;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <br/>
          <p>Thanks & Regards,</p>
          <strong>Team Concept Coaching Classes</strong>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err; // re-throw to handle in controller
  }
};

module.exports = sendEmail;
