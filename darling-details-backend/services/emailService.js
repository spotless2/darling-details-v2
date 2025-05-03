const nodemailer = require('nodemailer');

// Configure transport
const transporter = nodemailer.createTransport({
  host: 'smtp.migadu.com', // Or your email provider's SMTP server
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'contact@darlingdetails.ro',
    pass: process.env.EMAIL_PASSWORD, // Store this in env variables
  },
});

const emailService = {
  async sendContactForm(data) {
    const mailOptions = {
      from: '"Darling Details Website" <contact@darlingdetails.ro>',
      to: 'contact@darlingdetails.ro',
      replyTo: data.email,
      subject: `Formular de contact: ${data.name}`,
      html: `
        <h1>Mesaj nou de pe website</h1>
        <p><strong>Nume:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    return transporter.sendMail(mailOptions);
  },
};

module.exports = emailService;