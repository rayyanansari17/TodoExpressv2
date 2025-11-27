import mailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let email = process.env.EMAIL;
let pass = process.env.PASS;

function otpgenerator()
{
    let OTP = Math.floor(Math.random() * (9999 - 1000) + 1000);
    return OTP;
}

async function mails(name, mail, OTP)
{
    try {
        let transport = mailer.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: pass
            }
        });

        const info = await transport.sendMail({
            from: email,
            to:[mail],
            subject: `Welcome, ${name}`,
            text: `Hey ${name}, welcome aboard.\nThe OTP for your email verificatio is ${OTP}.\nHave a great time!`
        });
        console.log("Message sent:", info.messageId);
    } catch (error) {
        console.log(error);
    }
}

export {mails, otpgenerator};