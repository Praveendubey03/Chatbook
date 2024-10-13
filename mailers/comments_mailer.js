const nodeMailer = require('../config/nodemailer');

// Exporting the newComment function
exports.newComment = async (comment) => {
    console.log('Inside newComment mailer', comment);

    try {
        // If you want to render an HTML template, uncomment the following line
        let htmlString = await nodeMailer.renderTemplate({comment: comment }, '/comments/new_comment.ejs');

        const mailOptions = {
            from: 'codeial498@gmail.com', // Your sender email
            to: comment.user.email,        // The recipient's email
            subject: "New Comment Published",
            html: htmlString // You can also use htmlContent here
        };

        // Sending the email
        nodeMailer.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Error in sending mail:', err);
                return;
            }
            console.log('Message sent:', info);
        });
    } catch (error) {
        console.error('Error while sending email:', error);
    }
};