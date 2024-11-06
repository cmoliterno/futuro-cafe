import nodemailer from 'nodemailer';

export class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    public async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text,
            html,
        });
    }
}
