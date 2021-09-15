const { sendMail } = require('./sendmail');
const { checkMail } = require('./checkmail');
const { internalRedirect } = require('./internal-redirect');

exports.sendMail = sendMail;
exports.checkMail = checkMail;
exports.internalRedirect = internalRedirect;
