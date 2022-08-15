const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');       // This will be used to join the path, path is simply an inbuilt module for such purpose.



//The transporter is the part that defines how this transfer of mail is going to take place.
//We will be using TLS, and TLS is the highest form of security.
let transporter = nodemailer.createTransport({
    service : 'gmail',
    host : 'smtp.gmail.com',           //As developers, the gmail sending as a service must be very very fast and reliable, so this is kind of google's dedicated server to make this service optimized.
    port : 587,         //This port is for TLS protocol, and for the sending of mail, this service is the most secure one.
    secure : true,      //since we are going to do 2 factor authentication. And then we are passing the app password for this. Unless you do this you would not be able to send any mail from your account, since google does not support sending mails from less secure accounts now on.
    auth : {        //Setting up of authentication is necessary as you do not want to send mail from random users to random users. Authentication also helps the service providers to keep a track of how much mail have you sent over the time period.
        user : 'faizan.hyder0786@gmail.com',
        pass : 'xvnmnpchevmucstt'       //This is the actual password, this should not be kept like this, instead is should be kept in the process.env file. But the point is we could send mail from our account using this password.
    },
    tls: {
        rejectUnauthorized: false           //By setting rejectUnauthorized: false, you're saying "I don't care if I can't verify the server's identity." Obviously this is not a good solution as it leaves you vulnerable to MITM attacks.
    }
});




//This is to define we will be using the ejs package, so we need to define the template rendering engine properly.
let renderTemplate = (data, relativePath) => {      //I think this method will be used to add the correct html code that will be used to render the email.
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),     //This relativePath is the path from where this function is being called.
        data,                   //Data is all the data that we need to send into the render engine, to build the final renderFile.
        function(err, template){
         if (err){console.log('error in rendering template', err); return}         
         mailHTML = template;
        }
    )
    return mailHTML;
}


module.exports = {              //This is an another way of exporting the data in the form of objects.
    transporter: transporter,       
    renderTemplate: renderTemplate
}