import transporter from "../config/nodemailer.js";

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: to,
            subject: subject,
            text: text
        }

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };

    } catch (error) {

        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
};

export default sendEmail;
