// - profile
//  - type: User/Channel
//  - name
//  - title
//  - skin: blue/blue-light/purple/purple-light/black/black-light/red/red-light/yellow/yellow-light

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
  internalName() {
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
  skin() {
    return this.profile.skin || 'blue';
    // let skins = ['blue', 'blue-light', 'purple', 'purple-light', 'black', 'black-light', 'red', 'red-light', 'yellow', 'yellow-light'];
    // return skins[Math.round(Math.random() * skins.length)];
  }
});