const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP will expire after 5 minutes (300 seconds)
    },
});


// function to send verification email

async function sendVerificationEmail(email, otp) {
    try{
       const mailResponse = await mailSender(
        email, "Your OTP for Edufy", 
        `Your OTP is: ${otp}. 
        It will expire in 5 minutes.`
    );
        console.log("Email sent successfully: ", mailResponse);
       return mailResponse;
    } catch(err){
        console.log("Error sending email: ", err.message);
        throw err;
    }   
}


//pre save middleware to send OTP email before saving the document
otpSchema.pre('save', async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model('Otp', otpSchema);