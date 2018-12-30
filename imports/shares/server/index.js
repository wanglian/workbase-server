import '../shares.js';

Meteor.startup(function() {
  Threads.upsert({category: 'Shares'}, {$set: {subject: 'Shares'}});
});

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  let user = Users.findOne(attempt.user._id);
  let thread = Threads.findOne({category: 'Shares'});
  if (thread) {
    Threads.ensureMember(thread, user);
  }
});
