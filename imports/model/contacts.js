// - profile
//  - name
//  - noreply
Contacts = Meteor.users;

Contacts.helpers({
  noreply() {
    return this.profile && this.profile.noreply;
  }
});

export { Contacts };
