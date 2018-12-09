import './application-layout.html';
import './send-email-modal';
import './style.css';

const screenSizes = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200
};

Template.ApplicationLayout.onCreated(function() {

});

Template.ApplicationLayout.onDestroyed(function() {

});

Template.ApplicationLayout.onRendered(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

Template.ApplicationLayout.helpers({
  isInbox() {
    return Router.current().route.getName() === 'inbox';
  }
});

Template.ApplicationLayout.events({
  "click #btn-send-email"(e, t) {
    e.preventDefault();
    Modal.show("SendEmailModal");
  },
  "click #btn-sign-out"(e, t) {
    e.preventDefault();
    // history.go(-1);
    Meteor.logout();
  }
});
