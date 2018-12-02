import './application-layout.html';
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

});

Template.ApplicationLayout.events({
  "click .btn-sign-out"(e, t) {
    e.preventDefault();
    // history.go(-1);
    Meteor.logout();
  }
});
