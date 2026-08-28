const axios = require("axios");

const sendEmail = async (email, title, body) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Edufy", email: process.env.MAIL_USER },
        to: [{ email }],
        subject: title,
        htmlContent: body,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data.messageId);
    return response.data;
  } catch (err) {
    console.log("Error sending email:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = sendEmail;