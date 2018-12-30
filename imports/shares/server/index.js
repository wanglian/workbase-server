import '../shares.js';

Meteor.startup(() => {
  let admin = Instance.admin();
  let thread = Threads.findOne({category: 'Shares'});
  if (!thread) {
    let threadId = Threads.create(admin, 'Shares', 'Shares');
    thread = Threads.findOne(threadId);
  }

  Threads.ensureMember(thread, admin);
});

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  let user = Users.findOne(attempt.user._id);
  let thread = Threads.findOne({category: 'Shares'});
  if (thread) {
    Threads.ensureMember(thread, user);
  }
});
