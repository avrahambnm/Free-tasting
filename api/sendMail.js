import { sendMail } from '../backend/services/mailer.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body; // מקבל מהטופס
    const to = email;           // מגדיר את to
    const subject = 'הסרטונים שלך';
    const text = 'שלום! הנה הקישור לסרטונים שלך...';
    const html = `
      <p>שלום!</p>
      <p>הנה הקישור לסרטונים שלך: <a href="https://example.com/videos">לחץ כאן</a></p>
      <p>בברכה,</p>
      <p>צוות Free-tasting</p>
    `;

    try {
      const info = await sendMail(to, subject, text, html);
      res.status(200).json({ success: true, info });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
