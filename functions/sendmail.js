const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email || 'email';
const gmailPassword = functions.config().gmail.password || 'password';

const { EmailValidator } = require('./email-validator');
const emailValidator = new EmailValidator();

const MIN_ALLOWED_EMAIL_TRUST_RATE = 40;

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

exports.sendMail = functions.https.onRequest(async (req, res) => {
  let pb;
  try {
    pb = JSON.parse(req.body);
  } catch (e) {
    res.send(JSON.stringify({ error: 'wrong input params (json expected)' }));
    return res.status(400).end();
  }

  const userEmail = pb.email;
  const reqIp = req.headers['fastly-client-ip'];
  const { code, data } = await emailValidator.validate(userEmail, reqIp);

  if (code !== 200 || !data.trustRate || data.trustRate < MIN_ALLOWED_EMAIL_TRUST_RATE) {
    return res.status(412).send(JSON.stringify(data));
  }

  let keys = Object.keys(pb);

  let template = '<h2>Contact form from mailcheck.co</h2>';

  keys.forEach((e) => (template += `<p><b>${e}: </b>${pb[e]}</p>`));
  console.log('Got mail:', template);

  const mailOptions = {
    from: `Mailcheck Landing <${gmailEmail}>`,
    to: 'contact@mailcheck.co',
    subject: 'Mailcheсk form',
    html: template
  };

  mailTransport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending mail: ', error.message);
      res.send(JSON.stringify({ error: error.message }));
      return res.status(500).end();
    } else {
      console.log('Message sent to: ', info.envelope.to);
      res.send({ data: 'ok' });
      return res.status(200).end();
    }
  });
});
