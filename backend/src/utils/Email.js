import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', //true for 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export const sendEmail = async function(email, subject, text){
    await transporter.sendMail(
        {
            from: process.env.FROM_EMAIL,
            to: email,
            subject,
            text
        }
    )
}