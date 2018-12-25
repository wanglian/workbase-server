import '../roster';
import './methods';

Meteor.startup(() => {
  let admin = Instance.admin();
  let thread = Threads.findOne({category: 'Roster'});
  if (!thread) {
    let threadId = Threads.create(admin, 'Roster', 'Users Management');
    thread = Threads.findOne(threadId);
  }

  Threads.ensureMember(thread, admin);
});

Users.after.insert(function(userId, doc) {
  if (doc.profile.type != 'User') return;

  let admin = Meteor.user();
  if (admin) {
    let thread = Threads.findOne({category: 'Roster'});
    let user = this.transform();
    Threads.addMessage(thread, admin, {
      contentType: 'log',
      content: `New User: ${user.email()} \r\n ${JSON.stringify(user.profile)}`
    });
  }
});

Users.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (doc.profile.type != 'User') return;

  let admin = Meteor.user();
  if (admin) {
    let thread = Threads.findOne({category: 'Roster'});
    let user = this.transform();
    Threads.addMessage(thread, admin, {
      contentType: 'log',
      content: `Edit User: ${user.email()} \r\n Previous: ${JSON.stringify(_.pick(this.previous, fieldNames))} \r\n Update: ${JSON.stringify(modifier)}`
    });
  }
});
