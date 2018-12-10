// _.extend(Instance, {
const ROOT = {
  email: 'wanglian1024@gmail.com',
  profile: {
    name: 'Will',
    title: 'Developer'
  }
};

Meteor.startup(() => {
  Contacts.findOne({email: ROOT.email}) || Contacts.insert(ROOT);
});

const WELCOME_MAIL = {
  subject: 'Welcome to WeWork!',
  content: "If you have any questions, just ask me here..."
};
Accounts.onLogin(function(attempt) {
  let user = Users.findOne(attempt.user._id);
  // welcome
  if (ThreadUsers.find({userType: 'Users', userId: user._id}).count() === 0) {
    let root = Contacts.findOne({email: ROOT.email});
    let threadId = Threads.create(root, 'Email', WELCOME_MAIL.subject);
    let thread = Threads.findOne(threadId);
    Threads.ensureMember(thread, user);
    Threads.ensureMember(thread, root);
    Threads.addMessage(thread, root, {
      content: WELCOME_MAIL.content
    });
  }
});

const WELCOME_CHANNEL_MAIL = {
  subject: 'Congratulations!',
  content: "If you have any questions, just ask me here..."
};
Meteor.users.after.insert(function(userId, doc) {
  if (doc.profile && doc.profile.channel) {
    let channel = Channels.findOne(doc._id);
    if (ThreadUsers.find({userType: 'Channels', userId: doc._id}).count() === 0) {
      let root = Contacts.findOne({email: ROOT.email});
      let threadId = Threads.create(root, 'Email', WELCOME_CHANNEL_MAIL.subject, 'protected');
      let thread = Threads.findOne(threadId);
      Threads.ensureMember(thread, channel);
      Threads.ensureMember(thread, root);
      Threads.addMessage(thread, root, {
        content: WELCOME_CHANNEL_MAIL.content
      });
    }
  }
});