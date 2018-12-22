// - email
// - profile: name
// - noreply: boolean
Contacts = new Mongo.Collection('contacts');

Contacts.helpers({
  className() {
    return 'Contacts';
  },
  name() {
    return this.profile.name;
  },
  internalName() {
    return this.address();
  },
  address() {
    return `${this.profile.name} <${this.email}>`;
  }
});
