import '../shared';

let sharedThread;

Meteor.startup(function() {
  Threads.upsert({category: 'Shared'}, {$set: {subject: 'Shared', scope: 'public'}});
  sharedThread = Threads.findOne({category: 'Shared'});
});

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  let user = Users.findOne(attempt.user._id);
  let thread = Threads.findOne({category: 'Shared'});
  if (thread) {
    Threads.ensureMember(thread, user);
  }
});

Meteor.methods({
  addComment(messageId, comment) {
    check(messageId, String);
    check(comment, String);

    let user = Users.findOne(Meteor.userId());
    Threads.addMessage(sharedThread, user, {
      parentId: messageId,
      content: comment
    });
  }
});

Meteor.publishComposite("shared.thread", function() {
  return {
    find() {
      return Threads.find({category: 'Shared'});
    },
    children: [
      {
        find(thread) {
          return ThreadUsers.find({threadId: thread._id, userType: 'Users', userId: this.userId});
        }
      }
    ]
  }
});

const MIN_MESSAGES = 20;
const MAX_MESSAGES = 1000;
Meteor.publishComposite("shared.messages", function(userId, options) {
  check(userId, Match.Maybe(String));
  check(options, Match.Maybe({
    limit: Match.Maybe(Number)
  }));

  let limit = options && options.limit || MIN_MESSAGES;

  let threadId = sharedThread._id;
  let conditions = {threadId, parentId: {$exists: false}};
  let countName = "shared.messages";
  if (userId) {
    _.extend(conditions, {userId});
    countName = `shared.messages.${userId}`;
  }
  Counts.publish(this, countName, Messages.find(conditions, {sort: {createdAt: -1}}));

  return {
    find() {
      return Messages.find(conditions, {
        sort: {createdAt: -1},
        limit: Math.min(limit, MAX_MESSAGES)
      });
    },
    children: [
      {
        find(message) {
          return message.fileIds && Files.find({_id: {$in: message.fileIds}}).cursor;
        }
      },
      {
        find(message) {
          return message.inlineFileIds && Files.find({_id: {$in: message.inlineFileIds}}).cursor;
        }
      },
      {
        find(message) {
          return Messages.find({parentId: message._id});
        }
      }
    ]
  }
});
