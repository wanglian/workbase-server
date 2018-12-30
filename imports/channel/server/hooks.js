Threads.before.insert(function(userId, doc) {
  if (doc.userType === 'Channels') {
    // TODO: 这里的逻辑还有问题，Channel话题的回复不需要ThreadUser
    doc.scope = "protected";
  }
});

// send: username <channel@email>
Messages.before.insert(function(userId, doc) {
  // only outgoing messages
  if (doc.internal) return;
  let user = Users.findOne(doc.userId);
  if (!user) return;

  let tu = ThreadUsers.findOne({threadId: doc.threadId, userType: 'Channels'});
  if (tu) {
    let channel = Channels.findOne(tu.userId);
    doc.email = {
      from: `${user.name()} <${channel.email()}>`
    }
  }
});

// mark read when replied
Messages.after.insert(function(userId, doc) {
  // only outgoing messages
  if (doc.internal) return;
  let user = Users.findOne(doc.userId);
  if (!user) return;

  let tu = ThreadUsers.findOne({threadId: doc.threadId, userType: 'Channels'});
  if (tu) {
    ThreadUsers.update(tu._id, {$set: {read: true}});
  }
});
