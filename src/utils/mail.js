import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const SendMail=async(options)=>{
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Task Manager',
            link: 'https://mailgen.js/'
        },
    });

    var emailHTML = mailGenerator.generate(options.mailGenContent);
    var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_SMTP_USER,
          pass: process.env.MAILTRAP_SMTP_PASS,
        },
      });


      const mail ={
        from: 'onlyWebtech@gmail.com', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: emailText, // plain text body
        html: emailHTML, // html body
      };

      try {
            await transporter.sendMail(mail)
      } catch (error) {
            console.error("Email Failed");
      }
}

const emailVerificationMailGenContent=(Username,VerificationUrl)=>{
    return {
        body:{
            name:Username,
            intro:`Welcome to Our App! We are Very Excited To have you on board.`,
            action:{
                instructions: 'To get started with Our App, please click here:',
                button: {
                color: '#22BC66', // Optional action button color
                text: 'Verify your Email',
                link: VerificationUrl,
                        },
                    },
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
    }
}

const forgetPasswordMailGenContent=(Username,passwordResetURL)=>{
    return {
        body:{
            name:Username,
            intro:`We got a request to reset your password`,
            action:{
                instructions: 'To change your password Click the button',
                button: {
                color: '#22BC66', // Optional action button color
                text: 'Reset Password',
                link: passwordResetURL,
                        },
                    },
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
    }
}



export {SendMail,emailVerificationMailGenContent,forgetPasswordMailGenContent}