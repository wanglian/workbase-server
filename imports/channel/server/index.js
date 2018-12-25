import '../channel-users';
import './hooks';
import './functions';
import './methods';
import './publications';

Meteor.startup(() => {
  let admin = Instance.admin();
  let thread = Threads.findOne({category: 'Channel'});
  if (!thread) {
    let threadId = Threads.create(admin, 'Channel', 'Channel Management');
    thread = Threads.findOne(threadId);
  }

  Threads.ensureMember(thread, admin);
});

Channels.after.insert(function(userId, doc) {
  if (doc.profile.type != 'Channel') return;

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
  if (doc.profile.type != 'Channel') return;

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
    let member = this.transform();
    Threads.addMessage(thread, admin, {
      contentType: 'log',
      content: `Add Channel Member: \r\n Channel: ${thread.user().name()} (${thread.user().email()}) \r\n User: ${member.user().name()} (${member.user().email()})`
    });
  }
});

ChannelUsers.after.remove(function(userId, doc) {
  let admin = Meteor.user();
  if (admin) {
    let thread = Threads.findOne({category: 'Channel'});
    let member = this.transform();
    Threads.addMessage(thread, admin, {
      contentType: 'log',
      content: `Remove Channel Member: \r\n Channel: ${thread.user().name()} (${thread.user().email()}) \r\n User: ${member.user().name()} (${member.user().email()})`
    });
  }
});
