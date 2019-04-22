import '../channel-users';
import './hooks';
import './functions';
import './methods';
import './publications';

Meteor.startup(function() {
  let thread = Threads.findOne({category: 'Channel'});
  if (thread) {
    Threads.update(thread._id, {$set: {scope: 'test'}});
  } else {
    // Threads.create(null, 'Channel', 'thread_channels_management', 'admin');
  }
});

// Accounts.onLogin(function(attempt) {
//   // admin
//   let user = Users.findOne(attempt.user._id);
//   if (user && user.isAdmin()) {
//     let thread = Threads.findOne({category: 'Channel'});
//     thread && Threads.ensureMember(thread, user);
//   }
// });
