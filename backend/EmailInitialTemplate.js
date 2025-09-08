function emailInitialTemplate(frequency, to) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Confirmed!</title>
    <style>
        /* Basic styles for email client compatibility */
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f7;
            font-family: Arial, sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #4f46e5; /* Indigo color */
            color: #ffffff;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
            font-size: 16px;
        }
        .content p {
            margin: 0 0 15px;
        }
        .highlight {
            font-weight: bold;
            color: #4f46e5;
        }
        .footer {
            background-color: #f1f1f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
        .footer a {
            color: #4f46e5;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table class="container" border="0" cellspacing="0" cellpadding="0">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <h1>You're All Set!</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td class="content">
                            <p>Hi there,</p>
                            <p>Thank you for subscribing to Privacy Shield's assessment reminders. We've successfully received your request and are excited to help you stay on top of your digital privacy.</p>
                            <p>You have chosen to receive a reminder email <strong class="highlight">every ${frequency} months</strong>.</p>
                            <p>We've registered this subscription for the email address: <strong class="highlight">${to}</strong>.</p>
                            <p>No further action is needed from you. We will automatically send you an email with a link to retake the assessment when it's time.</p>
                            <p>Stay safe online!</p>
                            <p>Best regards,<br>The Privacy Shield Team</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p>You are receiving this email because you subscribed for assessment reminders on our website.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>


`;
}

module.exports = emailInitialTemplate;
