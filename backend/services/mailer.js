import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

// יצירת transporter יחיד לשימוש חוזר
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * שליחת מייל
 * @param {string} to - כתובת יעד
 * @param {string} subject - נושא המייל
 * @param {string} text - תוכן המייל (טקסט בלבד, כחלופה ל-HTML)
 * @param {string} htmlContent - תוכן המייל בפורמט HTML
 * @param {Array} attachments - מערך של קבצים מצורפים
 * @returns {Promise} - מבטיח סיום שליחה או שגיאה
 */
export async function sendMail(to, subject, text, htmlContent, attachments = []) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html: htmlContent,
            attachments: attachments
        });
        return info;
    } catch (error) {
        console.error('שגיאה בשליחת המייל:', error);
        throw error;
    }
}

/**
 * שליחת מייל אישור הרשמה
 * @param {string} to - כתובת יעד
 * @param {string} name - שם הנמען
 * @returns {Promise} - מבטיח סיום שליחה או שגיאה
 */
export async function sendRegistrationSuccessEmail(to, name) {
    const subject = 'הפרטים שלך נקלטו בהצלחה!';
    const templatePath = path.join(process.cwd(), 'mails', 'registration_success.html');
    let htmlContent = await fs.readFile(templatePath, 'utf8');

    htmlContent = htmlContent.replace('{{name}}', name);

    const attachments = [{
        filename: 'logo.png',
        path: path.join(process.cwd(), 'media', 'logo.png'),
        cid: 'logo' // Content ID for embedding in HTML
    }];

    return sendMail(to, subject, null, htmlContent, attachments);
}

