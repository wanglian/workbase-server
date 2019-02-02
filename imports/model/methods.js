import SimpleSchema from 'simpl-schema';

markRead = new ValidatedMethod({
  name: 'Threads.methods.read',
  validate: new SimpleSchema({
    threadId: { type: String }
  }).validator(),
  run({ threadId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      // Throw errors with a specific error code
      throw new Meteor.Error('Threads.methods.archive.notLoggedIn', 'Must be logged in.');
    }

    const tu = ThreadUsers.findOne({threadId, userType: 'Users', userId: this.userId});
    if (tu) {
      return ThreadUsers.update({threadId, userType: 'Users', userId: this.userId}, {$set: {read: true}});
    } else {
      throw new Meteor.Error('Threads.methods.archive.notExist', 'User does not have the thread.');
    }
  }
});

toggleArchiveThread = new ValidatedMethod({
  name: 'Threads.methods.archive',
  validate: new SimpleSchema({
    threadId: { type: String }
  }).validator(),
  run({ threadId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      // Throw errors with a specific error code
      throw new Meteor.Error('Threads.methods.archive.notLoggedIn', 'Must be logged in.');
    }

    const tu = ThreadUsers.findOne({threadId, userType: 'Users', userId: this.userId});
    if (tu) {
      Threads.update(threadId, {$set: {archive: !tu.archive}}); // just for client
      return ThreadUsers.update(tu._id, {$set: {archive: !tu.archive}});
    } else {
      throw new Meteor.Error('Threads.methods.archive.notExist', 'User does not have the thread.');
    }
  }
});

toggleStarThread = new ValidatedMethod({
  name: 'Threads.methods.star',
  validate: new SimpleSchema({
    threadId: { type: String }
  }).validator(),
  run({ threadId }) {
    if (!this.userId) {
      throw new Meteor.Error('Threads.methods.star.notLoggedIn', 'Must be logged in.');
    }

    const tu = ThreadUsers.findOne({threadId, userType: 'Users', userId: this.userId});
    if (tu) {
      Threads.update(threadId, {$set: {star: !tu.star}}); // just for client
      return ThreadUsers.update(tu._id, {$set: {star: !tu.star}});
    } else {
      throw new Meteor.Error('Threads.methods.star.notExist', 'User does not have the thread.');
    }
  }
});

togglePinMessage= new ValidatedMethod({
  name: 'Messages.methods.pin',
  validate: new SimpleSchema({
    messageId: { type: String }
  }).validator(),
  run({ messageId }) {
    if (!this.userId) {
      throw new Meteor.Error('Messages.methods.pin.notLoggedIn', 'Must be logged in.');
    }

    let message = Messages.findOne(messageId);
    const tu = message && ThreadUsers.findOne({threadId: message.threadId, userType: 'Users', userId: this.userId});
    if (tu) {
      if (message.pinAt) {
        Messages.update(messageId, {$unset: {pinAt: "", pinBy: ""}});
      } else {
        Messages.update(messageId, {$set: {pinAt: new Date(), pinUserId: this.userId}});
      }
    } else {
      throw new Meteor.Error('Messages.methods.pin.notExist', 'User does not have the message.');
    }
  }
});

updateMessage = new ValidatedMethod({
  name: 'Messages.methods.update',
  validate: new SimpleSchema({
    messageId: { type: String },
    content:   { type: String }
  }).validator(),
  run({ messageId, content }) {
    if (!this.userId) {
      throw new Meteor.Error('Messages.methods.update.notLoggedIn', 'Must be logged in.');
    }

    let message = Messages.findOne(messageId);
    // 限于本人修改，文本消息
    if (message && this.userId === message.userId && message.contentType === 'text') {
      return Messages.update(messageId, {$set: {content, updateUserId: this.userId}});
    } else {
      throw new Meteor.Error('Messages.methods.update.notExist', 'User does not have the message.');
    }
  }
});
