// - email
// - profile: name
Contacts = new Mongo.Collection('contacts');

const domain = 'weaworking.com';
const emailParser = require('address-rfc2822');
const parseEmailAddress = (emails) => {
  return emailParser.parse(emails);
};
Contacts.findOrCreateByAddress = (attrs) => {
  let email = attrs.address;
  if (attrs.host() === domain) {
    return Accounts.findUserByEmail(email);
  } else {
    let contact = Contacts.findOne({email});
    if (!contact) {
      contactId = Contacts.insert({
        email,
        profile: {
          name: attrs.name() || attrs.user()
        }
      });
      contact = Contacts.findOne(contactId);
    }
    return contact;
  }
};
Contacts.parseOne = (address) => {
  let attrs = parseEmailAddress(address)[0];
  return Contacts.findOrCreateByAddress(attrs);
};
Contacts.parse = (address) => {
  let users = parseEmailAddress(address).map(attrs => Contacts.findOrCreateByAddress(attrs));
  return _.compact(users);
};

Contacts.helpers({
  className() {
    return 'Contacts';
  },
  name() {
    return this.profile.name;
  },
  address() {
    return `${this.profile.name} <${this.email}>`;
  }
});
