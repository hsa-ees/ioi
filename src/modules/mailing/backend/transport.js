const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  service: process.env.MAILSERVICE,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASSWORD,
  },
});

export default transport