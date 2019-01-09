import '../channel-users';
import './hooks';
import './functions';
import './methods';
import './publications';

Meteor.startup(function() {
  Threads.findOne({category: 'Channel'}) || Threads.create(null, 'Channel', 'Channels Management', 'admin');
});

Accounts.onLogin(function(attempt) {
  // admin
  let admin = Instance.admin();
  if (admin._id === attempt.user._id) {
    let thread = Threads.findOne({category: 'Channel'});
    Threads.ensureMember(thread, admin);
  }
});

// const WELCOME_CHANNEL_MAIL = {
//   subject: 'Congratulations!',
//   content: "If you have any questions, just ask me here..."
// };
// Channels.after.insert(function(userId, doc) {
//   if (doc.profile && doc.profile.type === 'Channels') {
//     let channel = Channels.findOne(doc._id);
//     if (ThreadUsers.find({userType: 'Channels', userId: doc._id}).count() === 0) {
//       let root = Instance.admin() || Contacts.parseOne(ROOT);
//       let threadId = Threads.create(root, 'Email', WELCOME_CHANNEL_MAIL.subject, 'protected');
//       let thread = Threads.findOne(threadId);
//       Threads.ensureMember(thread, channel);
//       Threads.ensureMember(thread, root);
//       Threads.addMessage(thread, root, {
//         content: WELCOME_CHANNEL_MAIL.content
//       });
//     }
//   }
// });
