import '../roster';
import './methods';

Meteor.startup(function() {
  let thread = Threads.findOne({category: 'Roster'});
  if (thread) {
    //
  } else {
    Threads.create(null, 'Roster', 'Users Management', 'admin');
  }
});

Accounts.onLogin(function(attempt) {
  // admin
  let user = Users.findOne(attempt.user._id);
  if (user && user.isAdmin()) {
    let thread = Threads.findOne({category: 'Roster'});
    thread && Threads.ensureMember(thread, user);
  }
});
