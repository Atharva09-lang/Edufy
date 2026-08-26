exports.otpTemplate = (otp) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
    <style>
        body {
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 20px;
        }
        .message {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
        }
        .body {
            font-size: 15px;
            color: #475569;
            line-height: 1.6;
        }
        .otp {
            display: inline-block;
            margin: 20px 0;
            padding: 14px 32px;
            background-color: #f1f5f9;
            color: #2563eb;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 6px;
            border-radius: 6px;
        }
        .expiry {
            font-size: 13px;
            color: #ef4444;
            margin-top: 4px;
        }
        .support {
            margin-top: 24px;
            font-size: 13px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">Edufy</div>
        <div class="message">Verify your email</div>
        <div class="body">
            <p>Use the OTP below to verify your account and complete your registration.</p>
        </div>
        <div class="otp">${otp}</div>
        <div class="expiry">This OTP is valid for 5 minutes.</div>
        <div class="support">
            If you did not request this, please ignore this email or contact us at
            <a href="mailto:info@edufy.com">info@edufy.com</a>.
        </div>
    </div>
</body>
</html>`;
};