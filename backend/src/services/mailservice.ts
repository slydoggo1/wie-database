import Config from '../configs/globalConfig';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import handlebars from 'handlebars';
import path from 'path';

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: Config.EMAIL_USER,
    pass: Config.EMAIL_PASSWORD,
  },
});

export async function SendEmail(
  recipientEmail: string,
  subject: string,
  title: string,
  message: string,
): Promise<{ isSent: boolean; error?: string }> {
  const templatePath = path.join(__dirname, 'email.hbs');
  const emailTemplate = readFileSync(templatePath, 'utf-8');
  const compiledTemplate = handlebars.compile(emailTemplate);
  const htmlContent = compiledTemplate({ title, message });

  const options = {
    from: Config.EMAIL_USER,
    to: recipientEmail,
    subject: subject,
    html: htmlContent,
  };

  const sendMailPromise = promisify(transporter.sendMail.bind(transporter));

  try {
    await sendMailPromise(options);
    return { isSent: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return { isSent: false, error: errorMessage };
  }
}

module.exports = {
  SendEmail,
};
