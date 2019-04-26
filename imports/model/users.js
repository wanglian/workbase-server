Users = Meteor.users;

const addrparser = require('address-rfc2822');

Users.helpers({
  className() {
    return this.profile && this.profile.type || 'Users';
  },
  isAdmin() {
    return this.profile && this.profile.role === 'admin';
  },
  isMe(user) {
    return user && user.className() === 'Users' && user._id === this._id;
  },
  name() {
    return this.profile && this.profile.name;
  },
  language() {
    return this.profile && this.profile.language || 'en-US';
  },
  internal() {
    return this.className() !== 'Contacts';
  },
  internalName() {
    return this.internal() ? this.name() : this.address();
  },
  username() {
    let attrs = addrparser.parse(this.email());
    return attrs.user();
  },
  email() {
    return this.emails[0].address;
  },
  title() {
    return this.profile.title;
  },
  address() {
    return `${this.name()} <${this.email()}>`;
  },
  signature() {
    return this.profile.signature || `${this.name()}\r\n${this.email()}`;
  },
  skin() {
    return this.profile.skin || 'blue';
  }
});

Users.isAdmin = (userId) => {
  let user = Users.findOne(userId);
  return user && user.isAdmin();
};

export { Users };