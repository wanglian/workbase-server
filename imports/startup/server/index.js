import '../both';

const ROOT = {
  email: 'wanglian1024@gmail.com',
  profile: {
    name: 'William'
  }
}

Meteor.startup(() => {
  if (Users.find({}).count() === 0) {
    let params = {
      email: 'wanglian@weaworking.com',
      password: 'admin123',
      profile: {name: 'Wang Lian'}
    };
    console.log("[startup] create admin: ");
    console.log(params);
    Accounts.createUser(params);
  }
  if (Contacts.find({}).count() === 0) {
    Contacts.insert(ROOT);
  }
});

Accounts.onLogin(function(attempt) {
  let user = Users.findOne(attempt.user._id);
  // welcome
  if (ThreadUsers.find({userType: 'Users', userId: user._id}).count() === 0) {
    let threadId = Threads.create('Email', 'Welcome to WeWork!');
    let thread = Threads.findOne(threadId);
    let root = Contacts.findOne({email: ROOT.email});
    Threads.ensureMember(thread, user);
    Threads.ensureMember(thread, root);
    Threads.addMessage(thread, root, {
      content: "If you have any question, just ask me here..."
    });
  }
});