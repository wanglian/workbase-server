import moment from 'moment';

Meteor.methods({
  markRead(threadId) {
    check(threadId, String);
    ThreadUsers.update({threadId, userType: 'Users', userId: this.userId}, {$set: {read: true}});
  },
  sendMessage(threadId, params) {
    check(threadId, String);
    check(params, {
      contentType:   Match.Maybe(String),
      content:       String,
      internal:      Match.Maybe(Boolean),
      parentId:      Match.Maybe(String),
      fileIds:       Match.Maybe([String]),
      inlineFileIds: Match.Maybe([String])
    });

    let userId = this.userId;
    let user = Meteor.users.findOne(userId);
    let thread = Threads.findOne(threadId);
    let threadUser = ThreadUsers.findOne({threadId, userId, userType: 'Users'});

    if (thread && thread.scope != 'private' || threadUser) {
      return Threads.addMessage(thread, user, params);
    }
  },
  updateMessage(messageId, params) {
    check(messageId, String);
    check(params, {
      content: String
    });

    let message = Messages.findOne(messageId);
    // 限于本人修改，文本消息
    if (message && this.userId === message.userId && message.contentType === 'text') {
      return Messages.update(messageId, {$set: {content: params.content, updateUserId: this.userId}});
    }
    return false;
  },
  revokeMessage(messageId) {
    check(messageId, String);

    let message = Messages.findOne(messageId);
    if (message.createdAt < moment().subtract(2, 'minutes').toDate()) return false;

    let user = Users.findOne(this.userId);
    let thread = Threads.findOne(message.threadId);

    let re = Threads.revokeMessage(thread, message);
    logThread(thread, user, {
      action: "thread.revoke",
      params: {user: user.name()}
    });
    return re;
  },
  queryContacts(keyword) {
    check(keyword, String);

    let search = {$or: [
      {"profile.name": {$regex: keyword, $options: 'i'}},
      {"emails.address": {$regex: keyword, $options: 'i'}}
    ]};
    return Users.find(search, {limit: 12}).map(c => [{name: c.name(), email: c.email()}]);
  },
  queryContactsForThread(keyword, params) {
    check(keyword, String);
    check(params, Object);

    let threadId = params.id;
    let userIds = ThreadUsers.find({threadId, userType: 'Users'}).map(tu => tu.userId);
    let contactIds = ThreadUsers.find({threadId, userType: 'Contacts'}).map(tu => tu.userId);

    let search = {$or: [
      {"profile.name": {$regex: keyword, $options: 'i'}},
      {"emails.address": {$regex: keyword, $options: 'i'}}
    ]};
    return Users.find(_.extend(search, {_id: {$nin: userIds}}), {limit: 5}).map(c => [{name: c.name(), email: c.email()}]);
  },
  addThreadMembers(threadId, userIds) {
    check(threadId, String);
    check(userIds, [String]);

    let user = Users.findOne(this.userId);
    // TODO: 权限

    let thread = Threads.findOne(threadId);
    let members = userIds.map(userId => Users.findOne(userId));
    members.forEach(c => Threads.ensureMember(thread, c));

    logThread(thread, user, {action: "thread.members.add", params: {count: members.length, emails: members.map(m => m.address()).join(", ")}});
    return members.length;
  },
  removeThreadMember(threadId, userType, userId) {
    check(threadId, String);
    check(userType, String);
    check(userId, String);

    let user = Users.findOne(this.userId);
    let thread = Threads.findOne(threadId);
    let member = Users.findOne(userId);
    ThreadUsers.remove({threadId, userType, userId});
    logThread(thread, user, {action: "thread.members.remove", params: {email: member.address()}});
  }
});

const logThread = (thread, user, content) => {
  Threads.addMessage(thread, user, {
    contentType: 'log',
    content
  });
};
