const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email || 'email';
const gmailPassword = functions.config().gmail.password || 'password';

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendMail = functions.https.onRequest((req, res) => {

    let pb = JSON.parse(req.body);
    let keys = Object.keys(pb);

    let template = '';

    keys.forEach(e => template += `<p><b>${e}: </b>${pb[e]}</p>`);
    console.log('Got mail:',template);

  const mailOptions = {
    from: `Mailcheck Landing <${gmailEmail}>`,
    to: 'contact@mailcheck.co',
    subject: 'Mailcheсk form',
    html: template
  };

  mailTransport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error.message);
      res.send(JSON.stringify({error: error.message}));
      return res.status(500);
    } else {
      console.log('Message sent to:', info.envelope.to);
      res.send({data: 'ok'});
      res.status(200).end();
    }
  });
});
