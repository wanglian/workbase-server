// - profile
//  - type: Users/Channels
//  - livechat: Boolean // for Channels
//  - name
//  - title
//  - language
//  - skin: blue/blue-light/purple/purple-light/black/black-light/red/red-light/yellow/yellow-light
//  - signature
//  - message: personal signature

Users = Meteor.users;

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
    return this.profile.name;
  },
  internalName() {
    if (this.className() === 'Contacts') {
      return this.address();
    }
    return this.name();
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
    // let skins = ['blue', 'blue-light', 'purple', 'purple-light', 'black', 'black-light', 'red', 'red-light', 'yellow', 'yellow-light'];
    // return skins[Math.round(Math.random() * skins.length)];
  }
});