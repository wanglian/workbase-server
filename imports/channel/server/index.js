import '../channel-users';
import './hooks';
import './functions';
import './methods';
import './publications';

Instance.after.update(function(userId, doc, fieldNames, modifier, options) {
  // admin
  if (fieldNames.includes('adminId')) {
    let admin = Instance.admin();
    let thread = Threads.findOne({category: 'Channel'});
    if (!thread) {
      let threadId = Threads.create(admin, 'Channel', 'Channels Management');
      thread = Threads.findOne(threadId);
    }

    Threads.ensureMember(thread, admin);
  }
});

const WELCOME_CHANNEL_MAIL = {
  subject: 'Congratulations!',
  content: "If you have any questions, just ask me here..."
};
Channels.after.insert(function(userId, doc) {
  if (doc.profile && doc.profile.type === 'Channels') {
    let channel = Channels.findOne(doc._id);
    if (ThreadUsers.find({userType: 'Channels', userId: doc._id}).count() === 0) {
      let root = Instance.admin() || Contacts.parseOne(ROOT);
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

Channels.after.insert(function(userId, doc) {
  if (doc.profile.type != 'Channels') return;

  let admin = Meteor.user();
  if (admin) {
    let thread = Threads.findOne({category: 'Channel'});
    let user = this.transform();
    Threads.addMessage(thread, admin, {
      contentType: 'log',
      content: `New Channel: ${user.name()} - ${user.email()}`
    });
  }
});

Channels.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (doc.profile.type != 'Channels') return;

  let admin = Meteor.user();
  if (admin) {
    let thread = Threads.findOne({category: 'Channel'});
    let user = this.transform();
    Threads.addMessage(thread, admin, {
      contentType: 'log',
      content: `Edit Channel: ${user._id} \r\n Previous: ${this.previous.profile.name} - ${this.previous.emails[0].address} \r\n Update: ${user.name()} - ${user.email()}`
    });
  }
});

ChannelUsers.after.insert(function(userId, doc) {
  let admin = Meteor.user();
  if (admin) {
    let thread = Threads.findOne({category: 'Channel'});
    let channel = Channels.findOne(doc.channelId);
    let member = this.transform();
    Threads.addMessage(thread, admin, {
      contentType: 'log',
      content: `Add Channel Member: \r\n Channel: ${channel.name()} (${channel.email()}) \r\n User: ${member.user().name()} (${member.user().email()})`
    });
  }
});

ChannelUsers.after.remove(function(userId, doc) {
  let admin = Meteor.user();
  if (admin) {
    let thread = Threads.findOne({category: 'Channel'});
    let channel = Channels.findOne(doc.channelId);
    let member = this.transform();
    Threads.addMessage(thread, admin, {
      contentType: 'log',
      content: `Remove Channel Member: \r\n Channel: ${channel.name()} (${channel.email()}) \r\n User: ${member.user().name()} (${member.user().email()})`
    });
  }
});
