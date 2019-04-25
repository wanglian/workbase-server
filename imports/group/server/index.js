import '../';

const updateGroupSubject = (threadId) => {
  let thread = Threads.findOne(threadId);
  if (thread.name()) return;

  let members = thread.members();
  Threads.update(threadId, {$set: {
    subject: members.map(m => m.name()) // array
  }});
};

ThreadUsers.after.insert(function(userId, doc) {
  if (doc.category === 'Group') {
    updateGroupSubject(doc.threadId);
  }
});

ThreadUsers.after.remove(function(userId, doc) {
  if (doc.category === 'Group') {
    updateGroupSubject(doc.threadId);
  }
});

Threads.startGroup = (user, users) => {
  let threadId = Threads.create(user, 'Group');

  let thread = Threads.findOne(threadId);
  users.forEach((user) => {
    Threads.ensureMember(thread, user);
  });

  return thread;
};

const logGroup = (thread, user, content) => {
  Threads.addMessage(thread, user, {
    contentType: 'log',
    content
  });
};

Meteor.methods({
  startGroup(userIds) {
    check(userIds, [String]);
    
    let user = Users.findOne(this.userId);
    let users = userIds.map(userId => Users.findOne(userId));
    let thread = Threads.startGroup(user, users);

    logGroup(thread, user, {
      action: "group.create",
      params: {user: user.name(), users: users.map(m => m.internalName()).join(", ")}
    });
    return thread._id;
  },
  updateGroupName(threadId, name) {
    check(threadId, String);
    check(name, String);

    let user = Users.findOne(this.userId);
    let thread = Threads.findOne(threadId);
    let re = Threads.update(threadId, {$set: {subject: name}});

    logGroup(thread, user, {
      action: "group.name.update",
      params: {name}
    });
    return re;
  }
});
