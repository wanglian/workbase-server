import '../both';

Instance = {
  root: {
    email: 'wanglian1024@gmail.com',
    profile: {
      name: 'William'
    }
  },
  domain: "weaworking.com",
  admin: {
    id: 'wanglian',
    name: 'Wang Lian'
  }
};

Meteor.startup(() => {
  if (Users.find({}).count() === 0) {
    let params = {
      email: [Instance.admin.id, Instance.domain].join('@'),
      password: 'admin123',
      profile: {name: Instance.admin.name}
    };
    console.log("[startup] create admin: ");
    console.log(params);
    Accounts.createUser(params);
  }
  if (Contacts.find({}).count() === 0) {
    Contacts.insert(Instance.root);
  }
});

Accounts.onLogin(function(attempt) {
  let user = Users.findOne(attempt.user._id);
  // welcome
  if (ThreadUsers.find({userType: 'Users', userId: user._id}).count() === 0) {
    let root = Contacts.findOne({email: Instance.root.email});
    let threadId = Threads.create(root, 'Email', 'Welcome to WeWork!');
    let thread = Threads.findOne(threadId);
    Threads.ensureMember(thread, user);
    Threads.ensureMember(thread, root);
    Threads.addMessage(thread, root, {
      content: "If you have any question, just ask me here..."
    });
  }
});