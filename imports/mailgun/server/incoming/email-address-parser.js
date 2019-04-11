const emailParser = require('address-rfc2822');

parseEmailAddress = (emails) => {
  // purge
  emails = purgeEmails(emails);
  return emailParser.parse(emails);
};

const purgeEmails = (emails) => {
  emails = emails.trim();
  // ending with ',': 'abc@example.com,'
  let length = emails.length;
  if (emails[length-1] == ',') {
    emails = emails.substring(0, length - 1);
  }
  // names with '@': abc@example.com <abc@example.com>
  // TODO
  return emails;
};