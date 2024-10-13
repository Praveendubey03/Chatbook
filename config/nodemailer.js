const nodeMailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');



let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Set to true if using port 465
    tls: {
        rejectUnauthorized: false // Avoid issues with self-signed certificates
    },
    auth: {
        user: 'codeial498@gmail.com', // Use environment variable
        pass: 'wgpy nqpr bxuk numv',   // Use environment variable
    },
});

let renderTemplate = (data, relativePath) => {
    return new Promise((resolve, reject) => {
        const templatePath = path.join(__dirname, '../views/mailers', relativePath);
        console.log('Template path:', templatePath); // Debugging path
        ejs.renderFile(templatePath, data, function (err, template) {
            if (err) {
                console.log('Error in rendering templates:', err);
                reject(err);
            } else {
                resolve(template);
            }
        });
    });
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
