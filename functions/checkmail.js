const functions = require("firebase-functions");
const fetch = require("node-fetch");
const apiLink =
  (functions.config().mailcheck || {}).link ||
  "https://api.mailcheck.co/v1/singleEmail:check";
const apiKey = (functions.config().mailcheck || {}).key || "apiKey";

const ipCache = new Map();
const mailCache = new Map();

exports.checkMail = functions.https.onRequest((req, res) => {
  if (!req.body.email)
    return res.status(400).send(
      JSON.stringify({
        code: "400",
        message: "Bad request: no email passed",
      })
    );

  // console.log("fastly-client-ip:",req.headers["fastly-client-ip"]);
  // console.log("headers:",JSON.stringify(req.headers));

  console.log("link functions", functions.config().mailcheck.link);
  console.log("key functions", functions.config().mailcheck.key);
  const cachedResult = mailCache.get(req.body.email);
  // console.log("cachedResult:",cachedResult);

  if (cachedResult) return res.status(200).send(cachedResult);

  const reqIp = req.headers["fastly-client-ip"];
  let reqCount = ipCache.get(reqIp) || 0;
  reqCount++;
  ipCache.set(reqIp, reqCount);
  if (reqCount > 7)
    return res.status(429).send(
      JSON.stringify({
        code: "429",
        message: "rate limit reached for ip " + reqIp,
      })
    );
  console.log(reqIp + ": reqCount:", reqCount);

  fetch(apiLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + apiKey,
      "user-agent": "mailcheck landing",
    },
    body: JSON.stringify({ email: req.body.email }),
  })
    .then((apires) => {
      res.status(apires.status);
      return apires.text();
    })
    .then((json) => {
      mailCache.set(req.body.email, json);
      return res.send(json);
    })
    .catch((err) =>
      res
        .status(500)
        .send(JSON.stringify({ code: "500", message: err.toString() }))
    );
  return undefined;
});
