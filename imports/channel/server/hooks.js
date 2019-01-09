Threads.before.insert(function(userId, doc) {
  if (doc.userType === 'Channels') {
    doc.scope = "protected";
  }
});

const channelReplied = (message) => {
  if (doc.internal) return false;

  let tu = ThreadUsers.findOne({threadId: doc.threadId, userType: 'Channels'});
  if (tu) { // is channel
    let thread = Threads.findOne(doc.threadId);
    if (thread.userId != doc.userId) { // from user
      return tu;
    }
  }

  return false;
};

// 外发邮件: 发自 username <channel@email>
Messages.before.insert(function(userId, doc) {
  let tu = channelReplied(doc);
  if (tu) {
    let channel = Channels.findOne(tu.userId);
    let user = Users.findOne(doc.userId);
    doc.email = {
      from: `${user.name()} <${channel.email()}>`
    }
  }
});

// 回复后标记已读
Messages.after.insert(function(userId, doc) {
  let tu = channelReplied(doc);
  if (tu) {
    ThreadUsers.update(tu._id, {$set: {read: true}});
  }
});
