import '../shared';

let sharedThread;

Meteor.startup(function() {
  Threads.upsert({category: 'Shared'}, {$set: {subject: 'Shared', scope: 'public'}});
  sharedThread = Threads.findOne({category: 'Shared'});
  if (Instance.get().sharedId != sharedThread._id) {
    Instance.update({}, {$set: {sharedId: sharedThread._id}});
  }
});

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  // let user = Users.findOne(attempt.user._id);
  // let thread = Threads.findOne({category: 'Shared'});
  // if (thread) {
  //   Threads.ensureMember(thread, user);
  // }
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

const MIN_MESSAGES = 20;
const MAX_MESSAGES = 1000;
Meteor.publishComposite("shared.messages", function(options) {
  check(options, {
    limit: Match.Maybe(Number)
  });

  let limit = options && options.limit || MIN_MESSAGES;

  let threadId = sharedThread._id;
  Counts.publish(this, "shared.messages", Messages.find({threadId, parentId: {$exists: false}}, {sort: {createdAt: -1}}));

  return {
    find() {
      return Messages.find({threadId}, {
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
