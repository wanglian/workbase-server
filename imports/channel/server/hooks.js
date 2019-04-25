Threads.before.insert(function(userId, doc) {
  if (doc.userType === 'Channels') {
    doc.scope = "protected";
  }
});

const channelReplied = (message) => {
  if (message.internal) {
    return false;
  }

  let tu = ThreadUsers.findOne({threadId: message.threadId, userType: 'Channels'});
  if (tu) { // is channel
    let thread = Threads.findOne(message.threadId);
    if (thread.userId !== message.userId) { // from user
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
    };
  }
});

// 回复后标记已读
Messages.after.insert(function(userId, doc) {
  let tu = channelReplied(doc);
  tu && ThreadUsers.update(tu._id, {$set: {read: true}});
});
