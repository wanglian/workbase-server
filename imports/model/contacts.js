// - email
// - name
Contacts = new Mongo.Collection('contacts');

Contacts.helpers({
  className() {
    return 'Contacts';
  }
});
