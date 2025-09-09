function emailTemplate(assessmentLink) {
    return `
<!DOCTYPE html>
<html>
<head>
<title>Your Privacy Assessment Reminder</title>
<style>
  /* Basic styles for email client compatibility */
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    border: 1px solid #dddddd;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .header h1 {
    color: #4A5568; /* A nice muted blue/gray */
  }
  .content p {
    margin-bottom: 20px;
  }
  .cta-button {
    display: block;
    width: 200px;
    margin: 30px auto;
    padding: 15px 20px;
    background-color: #6B46C1; /* The purple from your app */
    color: #ffffff;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
  }
  .footer {
    margin-top: 30px;
    text-align: center;
    font-size: 12px;
    color: #777777;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Time for Your Privacy Check-up!</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>This is your friendly reminder to retake your Privacy Shield assessment, as you requested.</p>
      <p>The digital world is constantly changing, and so are the risks to your privacy. Taking a few minutes to reassess your habits can help you stay protected against new and evolving threats.</p>
      
      <!-- The main call-to-action button -->
      <a href="${assessmentLink}" class="cta-button">Take the Assessment Now</a>
      
      <p>If the button above doesn't work, you can copy and paste this link into your browser:<br>
      <a href="${assessmentLink}">[${assessmentLink}]</a></p>
    </div>
    <div class="footer">
      <p>You are receiving this email because you subscribed to reminders on our website.</p>
      <p>&copy; 2025 Privacy Shield. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

`;
}

module.exports = emailTemplate;
