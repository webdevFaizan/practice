const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;


//All these are copied from the documentation page of the mailgun.js
//https://www.youtube.com/watch?v=3bxjvequldY&ab_channel=DevSprout 
//Watch this video to have better understanding about this library.
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});

const messageData = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'backup.errorcode@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};

client.messages.create(DOMAIN, messageData)
 .then((res) => {
   console.log(res);
 })
 .catch((err) => {
   console.error(err);
 });

// module.exports.sendMail=client;