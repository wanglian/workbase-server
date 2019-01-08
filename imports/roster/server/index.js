import '../roster';
import './methods';

Meteor.startup(function() {
  Threads.upsert({category: 'Roster'}, {$set: {subject: 'Users Management', scope: 'private'}});
});

Accounts.onLogin(function(attempt) {
  // admin
  let admin = Instance.admin();
  if (admin._id === attempt.user._id) {
    let thread = Threads.findOne({category: 'Roster'});
    Threads.ensureMember(thread, admin, {admin: true});
  }
});
