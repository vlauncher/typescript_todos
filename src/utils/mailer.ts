import nodemailer from 'nodemailer';
import { config } from './config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmailUser,
    pass: config.gmailPass,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: config.gmailUser,
    to,
    subject,
    html,
  });
}; 