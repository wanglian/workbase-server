import '../roster';
import './methods';

Meteor.startup(function() {
  Threads.findOne({category: 'Roster'}) || Threads.create(null, 'Roster', 'Users Management', 'admin');
});

Accounts.onLogin(function(attempt) {
  // admin
  let admin = Instance.admin();
  if (admin._id === attempt.user._id) {
    let thread = Threads.findOne({category: 'Roster'});
    Threads.ensureMember(thread, admin);
  }
});
