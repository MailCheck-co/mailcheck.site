const functions = require('firebase-functions');
const { EmailValidator } = require('./email-validator');

const emailValidator = new EmailValidator();

exports.checkMail = functions.https.onRequest(async (req, res) => {
  if (!req.body.email)
    return res.status(400).json({
      code: '400',
      message: 'Bad request: no email passed'
    });

  // console.log("fastly-client-ip:",req.headers["fastly-client-ip"]);
  // console.log("headers:",JSON.stringify(req.headers));

  functions.logger.log('link functions', functions.config().mailcheck?.link);
  functions.logger.log('key functions', functions.config().mailcheck?.key);

  const email = req.body.email;
  const reqIp = req.headers['fastly-client-ip'];
  const { code, data } = await emailValidator.validate(email, reqIp);

  return res.status(code).json(data);
});
