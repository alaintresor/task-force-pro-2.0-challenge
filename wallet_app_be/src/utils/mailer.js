import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export const emailTransport = () => {
  return nodemailer.createTransport({
    host: "smtp.hostinger.com",
    secure: true,
    secureConnection: false,
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: 465,
    debug: true,
    connectionTimeout: 10000,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

class SendEmail {
  constructor(booking, message) {
    this.to = booking && booking.user.email;
    this.name = booking && booking?.user?.name;
    this.travellerNumber = booking && booking?.travellerNumber;
    this.package = booking && booking?.package;
    this.addons = booking && booking?.addOns;
    this.arrivalDate = booking && booking?.arrivalDate;
    this.booking = booking ? booking : null;
    this.message = message;

    this.from = `Loyal Lover First <${process.env.EMAIL_FROM}>`;
  }

  async send(template, subject) {
    const html = await ejs.renderFile(
      path.join(__dirname, `./../emailTemplates/${template}.ejs`),
      {
        name: this.name,
        travellerNumber: this.travellerNumber,
        package: this.package,
        addons: this.addons,
        arrivalDate: this.arrivalDate,
        booking: this.booking,
        message: this.message,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: html,
    };

    await emailTransport().sendMail(mailOptions);
  }

  async forgetPassword() {
    await this.send("forgetPassword", "Forget Password");
  }
  async contactFormSubmission() {
    await this.send("contactFormSubmission", "Contact Form Submission");
  }
}

export default SendEmail;
