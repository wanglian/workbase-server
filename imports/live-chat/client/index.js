import '../live-chat';
import './view';

Router.route('/contact', {
  name: 'contact',
  template: 'Contact',
  waitOn() {
    return Meteor.subscribe("site");
  }
});