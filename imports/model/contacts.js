// - email
// - profile: name
Contacts = new Mongo.Collection('contacts');

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
