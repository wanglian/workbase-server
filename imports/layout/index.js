import './application-status';
import './application-layout';
import './application-controller';

Accounts.onLogin(function(attempt) {
  Meteor.subscribe("instance");
  Meteor.subscribe("roster");
});
