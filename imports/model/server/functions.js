Threads.create = (user, category, subject, scope="private") => {
  return Threads.insert({
    userType: user && user.className(),
    userId: user && user._id,
    category,
    subject,
    scope
  });
};

Threads.ensureMember = (thread, user, params) => {
  let threadId = thread._id;
  let userType = user.className();
  let userId   = user._id;

  let threadUser = ThreadUsers.findOne({threadId, userType, userId});
  if (!threadUser) {
    let role = 'member';
    let read = false;
    if (thread.userType === user.className() && thread.userId === user._id) {
      // thread creator becomes the owner
      role = 'owner';
      read = true;
    } else if (ThreadUsers.find({threadId: thread._id, userType: 'Users'}).count() === 0) {
      // first internal user
      role = 'owner';
    }

    ThreadUsers.insert({
      threadId,
      userType,
      userId,
      category: thread.category,
      scope: thread.scope,
      read,
      role,
      params
    });
  } else {
    if (threadUser.archive) {
      ThreadUsers.update(threadUser._id, {$set: {archive: false}});
    }
  }
};

Threads.addMessage = (thread, user, message) => {
  let mid = Messages.insert(_.extend({
    threadId: thread._id,
    userType: user.className(),
    userId:   user._id
  }, message));
  let t = new Date();
  Threads.update(thread._id, {$set: {lastMessageId: mid, updatedAt: t}});
  // mark unread, check archive
  ThreadUsers.update({
    threadId: thread._id, userType: 'Users', userId: {$ne: user._id}
  }, {$set: {
    read: false, updatedAt: t, archive: false
  }}, {multi: true});
  // mark read, check archive
  ThreadUsers.update({
    threadId: thread._id, userType: 'Users', userId: user._id
  }, {$set: {
    read: true, updatedAt: t, archive: false
  }});
  return mid;
};

Threads.revokeMessage = (thread, message) => {
  let count = Messages.remove({_id: message._id});
  // 文件是否直接删除
  return count;
};

const emailParser = require('address-rfc2822');
const parseEmailAddress = (emails) => {
  return emailParser.parse(emails);
};
Contacts.findOrCreateByAddress = (attrs) => {
  let email = attrs.address;
  let contact = Accounts.findUserByEmail(email);

  if (attrs.host() === Instance.domain()) {
    return contact;
  } else {
    if (!contact) {
      let noreply = !!email.match(/noreply|no_reply|no-reply|do-not-reply|do_not_reply|donotreply/i);
      let contactId = Accounts.createUser({
        email,
        profile: {
          type: 'Contacts',
          name: attrs.name() || attrs.user(),
          noreply
        }
      })
      contact = Contacts.findOne(contactId);
    }
    return contact;
  }
};

Contacts.parseOne = (address) => {
  let attrs = parseEmailAddress(address)[0];
  return Contacts.findOrCreateByAddress(attrs);
};

Contacts.parse = (address) => {
  let users = parseEmailAddress(address).map(attrs => Contacts.findOrCreateByAddress(attrs));
  return _.compact(users);
};
