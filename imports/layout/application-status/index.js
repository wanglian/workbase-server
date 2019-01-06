import './view.html';
import './style.css';

Template.ApplicationStatus.helpers({
  connected() {
    return Meteor.status().connected;
  },
  connecting() {
    let s = Meteor.status();
    return s.status === 'connecting' || (s.status === 'waiting' && s.retryCount < 5);
  }
});

Template.ApplicationStatus.events({
  "click #btn-connect"(e, t) {
    e.preventDefault();
    e.stopPropagation();
    Meteor.reconnect();
  }
});
