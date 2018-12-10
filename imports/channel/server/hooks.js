Threads.before.insert(function(userId, doc) {
  if (doc.userType === 'Channel') {
    doc.scope = "protected";
  }
});

// send: username <channel@email>
Messages.before.insert(function(userId, doc) {
  if (!userId || doc.internal) return; // only outgoing messages
  let tu = ThreadUsers.findOne({threadId: doc.threadId, userType: 'Channels'});
  if (tu && tu.userId != doc.userId) {
    let user = Users.findOne(doc.userId);
    let channel = Channels.findOne(tu.userId);
    doc.email = {
      from: `${user.name()} <${channel.email()}>`
    }
  }
});

// mark read when replied
Messages.after.insert(function(userId, doc) {
  if (!userId || doc.internal) return; // only outgoing messages
  let tu = ThreadUsers.findOne({threadId: doc.threadId, userType: 'Channels'});
  if (tu && tu.userId != doc.userId) {
    ThreadUsers.update(tu._id, {$set: {read: true}});
  }
});
