//This will consist of all the comments related mails, when ever any user comments on a post, the postowner must get that mail, in order to improve the engagement.


const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
//As soon as this method is called, with comment being passed to it, the renderTemplate is called and it renders a new template, with what ever content we wish to push, in the front end framework of the ejs. Then the transporter method sends in the transport call to the nodeMailer and the mail is sent.
exports.newComment = (comment) => {
    // console.log('inside newComment mailer', comment);
    const htmlString = nodeMailer.renderTemplate({comment : comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
       from: 'faizan.hyder0786@gmail.com',
       to: comment.user.email,
       subject: "Comment Published!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}