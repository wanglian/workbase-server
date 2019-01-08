import '../channel-users';
import './hooks';
import './functions';
import './methods';
import './publications';

Meteor.startup(function() {
  Threads.upsert({category: 'Channel'}, {$set: {subject: 'Channels Management', scope: 'private'}});
});

Accounts.onLogin(function(attempt) {
  // admin
  let admin = Instance.admin();
  if (admin._id === attempt.user._id) {
    let thread = Threads.findOne({category: 'Channel'});
    Threads.ensureMember(thread, admin, {admin: true});
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

const logChannelAdmin = (admin, content) => {
  let thread = Threads.findOne({category: 'Channel'});
  Threads.addMessage(thread, admin, {
    contentType: 'log',
    content
  });
};

Channels.after.insert(function(userId, doc) {
  if (doc.profile.type != 'Channels') return;

  let admin = Meteor.user();
  if (admin) {
    let channel = this.transform();
    logChannelAdmin(admin, {
      action: 'channel.new',
      params: {
        channel: channel.address()
      }
    });
  }
});

Channels.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (doc.profile.type != 'Channels') return;

  let admin = Meteor.user();
  if (admin) {
    let channel = this.transform();
    logChannelAdmin(admin, {
      action: 'channel.edit',
      params: {
        prev: Channels._transform(this.previous).address(),
        now: channel.address()
      }
    });
  }
});

ChannelUsers.after.insert(function(userId, doc) {
  let admin = Meteor.user();
  if (admin) {
    let channel = Channels.findOne(doc.channelId);
    let member = this.transform();
    logChannelAdmin(admin, {
      action: 'channe.member.add',
      params: {
        channel: channel.address(),
        member: member.user().address()
      }
    });
  }
});

ChannelUsers.after.remove(function(userId, doc) {
  let admin = Meteor.user();
  if (admin) {
    let channel = Channels.findOne(doc.channelId);
    let member = this.transform();
    logChannelAdmin(admin, {
      action: 'channe.member.remove',
      params: {
        channel: channel.address(),
        member: member.user().address()
      }
    });
  }
});
