import nodemailer from 'nodemailer';

export const EmailService = {
    async sendEmail(to: string, subject: string, html: string) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"SecureCare Alerts" <noreply@securecare.local>',
                to,
                subject,
                html,
            });

            console.log(`Email successfully sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
            // We don't throw an error here to prevent the main transaction (like registration) from rolling back just because an email failed to send.
        }
    }
};
