Threads.create = (user, category, subject, scope="private") => {
  return Threads.insert({
    userType: user.className(),
    userId: user._id,
    category,
    subject,
    scope
  });
};

Threads.ensureMember = (thread, user, params) => {
  let role = (thread.userType === user.className() && thread.userId === user._id) ? 'owner' : 'member';
  ThreadUsers.upsert({
    threadId: thread._id,
    userType: user.className(),
    userId:   user._id
  }, {$set: {
    category: thread.category,
    read: false,
    role,
    params
  }});
};

Threads.addMessage = (thread, user, message) => {
  let mid = Messages.insert(_.extend({
    threadId: thread._id,
    userType: user.className(),
    userId:   user._id
  }, message));
  Threads.update(thread._id, {$set: {lastMessageId: mid}});
  ThreadUsers.update({threadId: thread._id, userType: 'Users', userId: {$ne: user._id}}, {$set: {read: false}}, {multi: true}); // mark unread
  ThreadUsers.update({threadId: thread._id, userType: 'Users', userId: user._id}, {$set: {read: true}}); // mark read
  return mid;
};

const emailParser = require('address-rfc2822');
const parseEmailAddress = (emails) => {
  return emailParser.parse(emails);
};
Contacts.findOrCreateByAddress = (attrs) => {
  let email = attrs.address;
  if (attrs.host() === Instance.domain()) {
    return Accounts.findUserByEmail(email);
  } else {
    let contact = Contacts.findOne({email});
    if (!contact) {
      contactId = Contacts.insert({
        email,
        profile: {
          name: attrs.name() || attrs.user()
        }
      });
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
