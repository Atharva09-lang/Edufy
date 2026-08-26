const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// reset password --> generate token
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "This email does not exist"
            });
        }

        const token = crypto.randomUUID();

        await User.findOneAndUpdate(
            { email },
            {
                token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);

        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please check your mail"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to send the email"
        });
    }
};

// reset password --> update password
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const userDetails = await User.findOne({ token });
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Token is invalid"
            });
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token has expired, please regenerate a new one"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            { token },
            { password: hashedPassword, token: undefined },
            { new: true },
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Password could not be reset"
        });
    }
};