const nodemailer = require('nodemailer');

const sendEmail = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    let info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`
    });

    console.log('Email sent successfully');
    return info;
  }
  catch (err) {
    console.log(err.message);
    throw err; // let the caller know it actually failed
  }
};

module.exports = sendEmail;