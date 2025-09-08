// backend/utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // your gmail 
        pass: process.env.EMAIL_PASS, // app password 
    },
});

async function sendEmail(to, subject, html) {
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
}

module.exports = sendEmail;
