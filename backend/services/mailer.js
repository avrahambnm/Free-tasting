import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import juice from 'juice';

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
    try {
        const subject = 'הפרטים שלך נקלטו בהצלחה!';
        const templatePath = path.join(process.cwd(), 'mails', 'registration_success.html');
        
        let htmlContent;
        try {
            htmlContent = await fs.readFile(templatePath, 'utf8');
        } catch (readError) {
            console.error('Error reading email template:', readError);
            throw new Error('Failed to read email template.');
        }

        htmlContent = htmlContent.replace('{{name}}', name);
        htmlContent = juice(htmlContent);

        const attachments = [{
            filename: 'logo.png',
            path: path.join(process.cwd(), 'media', 'logo.png'),
            cid: 'logo' // Content ID for embedding in HTML
        }];

        const plainTextContent = `${name} יקר,

להוציא ממך אותך

הפרטים שלך נקלטו בהצלחה!
בעזרת השם, אצור איתך קשר בהקדם.

בברכה,
אברהם

טלפון: 052-305-1441
מייל: avrahambnm@gmail.com
בקר באתר שלנו: [קישור לאתר]
אינסטגרם: https://www.instagram.com/avraham270?utm_source=qr
וואטסאפ: https://api.whatsapp.com/send?phone=972523051441

© 2025 אברהם. כל הזכויות שמורות.`;

        console.log(`Attempting to send registration email to: ${to}`);
        const info = await sendMail(to, subject, null, htmlContent, attachments);
        console.log('Registration email sent successfully:', info);
        return info;
    } catch (error) {
        console.error('Error in sendRegistrationSuccessEmail:', error);
        throw error; // Re-throw to propagate the error to the caller (api.js)
    }
}

