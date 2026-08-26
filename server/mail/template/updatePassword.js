exports.passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Updated</title>
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
            text-align: left;
        }
        .warning {
            margin-top: 20px;
            padding: 14px;
            background-color: #fef2f2;
            color: #b91c1c;
            font-size: 13px;
            border-radius: 6px;
            text-align: left;
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
        <div class="message">Password updated successfully</div>
        <div class="body">
            <p>Hi ${name},</p>
            <p>This is a confirmation that the password for your account (<strong>${email}</strong>) was just changed.</p>
        </div>
        <div class="warning">
            If you did not make this change, please reset your password immediately or contact us at
            info@edufy.com.
        </div>
        <div class="support">
            Thanks,<br>The Edufy Team
        </div>
    </div>
</body>
</html>`;
};