import nodemailer from "nodemailer"
import { dataSendMail } from "../types.js"

const send = async (data: dataSendMail) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    })

    await transporter.sendMail({
        from: '"GIChat 📧" <gichatapp@gmail.com>',
        to: data.to,
        subject: data.subject,
        text: data.text
    });
}

export const sendEmail = {
    send
}