Users = Meteor.users;

Users.helpers({
  className() {
    return 'Users';
  },
  isAdmin() {
    return this.profile && this.profile.role === 'admin';
  },
  isMe(user) {
    return user && user.className() === 'Users' && user._id === this._id;
  },
  name() {
    return this.profile.name;
  },
  email() {
    return this.emails[0].address;
  },
  title() {
    return this.profile.title;
  },
  address() {
    return `${this.name()} <${this.email()}>`;
  }
});