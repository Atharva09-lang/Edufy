const axios = require("axios");

const sendEmail = async (email, title, body) => {
  try {
    const response = await axios.post(
      "https://api.elasticemail.com/v4/emails/transactional",
      {
        Recipients: [
          {
            Email: email
          }
        ],
        Content: {
          Body: [
            {
              ContentType: "HTML",
              Content: body
            }
          ],
          Subject: title,
          From: process.env.MAIL_USER
        }
      },
      {
        headers: {
          "X-ElasticEmail-ApiKey": process.env.ELASTIC_EMAIL_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Email sent successfully");
    return response.data;
  } catch (err) {
    console.log("Error sending email:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = sendEmail;