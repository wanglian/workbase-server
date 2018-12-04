// - email
// - profile: name
Contacts = new Mongo.Collection('contacts');

Contacts.helpers({
  className() {
    return 'Contacts';
  },
  address() {
    return `${this.profile.name} <${this.email}>`;
  }
});
