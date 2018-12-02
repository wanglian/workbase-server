let api_key = 'key-8ygfsuyrnqhip88wryqrzjilak5d1ai5';
let domain = 'weaworking.com';
let client = require('mailgun-js')({apiKey: api_key, domain: domain});

Mailgun = {
  client,
  send: (data, callback) => {
    client.messages().send(data, function (error, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(body);
      }
    });
  }
};
