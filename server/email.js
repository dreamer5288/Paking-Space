const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASS
        user: 'parkinspaceiiita@gmail.com',
        pass: 'abcabc123123'
    }
});

sendEmail = (transporter,mailOptions) =>{
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    transporter,
    sendEmail
}
