Meteor.publish('instance', function() {
  if (!this.userId) return this.ready();

  Counts.publish(this, 'count-unread-inbox', ThreadUsers.find({
    scope:    'private',
    userType: 'Users',
    userId:   this.userId,
    read:     false
  }));

  Counts.publish(this, 'count-star', ThreadUsers.find({
    userType: 'Users',
    userId:   this.userId,
    star:     true
  }));

  ChannelUsers.find({userId: this.userId}).forEach((cu) => {
    Counts.publish(this, `count-unread-channel-${cu.channelId}`, ThreadUsers.find({
      userType: 'Channels',
      userId:   cu.channelId,
      read:     false
    }));
  });

  Counts.publish(this, 'count-mailgun-error', MailgunEmails.find({parsedAt: {$exists: false}}));

  return [
    Instance.find({}, {fields: {domain: 1, company: 1, adminId: 1, sharedId: 1}}),
    Threads.find({category: 'Account', userId: this.userId})
  ];
});

const MIN_THREADS = 20;
const MAX_THREADS = 200;
Meteor.publishComposite("threads", function(options) {
  check(options, Match.Maybe({
    category: Match.Maybe(String),
    limit: Match.Maybe(Number)
  }));

  let conditions = {scope: 'private', userType: 'Users', userId: this.userId, archive: {$ne: true}};
  let category = options && options.category;
  if (category) {
    _.extend(conditions, {category});
  }

  let limit = options && options.limit || MIN_THREADS;

  let countName = category ? `threads.${category}` : 'threads';
  Counts.publish(this, countName, ThreadUsers.find(conditions, {sort: {updatedAt: -1}}));

  return {
    find() {
      return ThreadUsers.find(conditions, {
        sort: {updatedAt: -1},
        limit: Math.min(limit, MAX_THREADS)
      });
    },
    children: [
      {
        find(tu) {
          return Threads.find({_id: tu.threadId}, {
            transform: (doc) => {
              doc.read = tu.read;
              doc.archive = tu.archive;
              doc.star = tu.star;
              doc.params = tu.params;
              return doc;
            }
          });
        },
        children: [
          {
            find(thread) {
              return Messages.find({_id: thread.lastMessageId});
            },
            children: [
              {
                find(message) {
                  return Users.find({_id: message.userId});
                }
              }
            ]
          }
        ]
      }
    ]
  };
});

Meteor.publishComposite("thread", function(threadId) {
  check(threadId, String);

  return {
    find() {
      return ThreadUsers.find({threadId, userType: 'Users', userId: this.userId});
    },
    children: [
      {
        find(tu) {
          return Threads.find({_id: threadId}, {
            transform: (doc) => {
              doc.read = tu.read;
              doc.archive = tu.archive;
              doc.star = tu.star;
              doc.params = tu.params;
              return doc;
            }
          });
        }
      },
      {
        find(tu) {
          return ThreadUsers.find({threadId}, {fields: {read: 0}});
        }
      }
    ]
  };
});

const MIN_MESSAGES = 20;
const MAX_MESSAGES = 1000;
Meteor.publishComposite("thread.messages", function(threadId, options) {
  check(threadId, String);
  check(options, {
    limit: Match.Maybe(Number)
  });

  let limit = options && options.limit || MIN_MESSAGES;

  let countName = `messages.${threadId}`;
  Counts.publish(this, countName, Messages.find({threadId}));

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
      }
    ]
  }
});

Meteor.publishComposite("thread.messages.pin", function(threadId, options) {
  check(threadId, String);
  check(options, Match.Maybe({
    limit: Match.Maybe(Number)
  }));

  let conditions = {threadId, pinAt: {$exists: true}};
  let limit = options && options.limit || MIN_MESSAGES;

  let countName = `messages.pin.${threadId}`;
  Counts.publish(this, countName, Messages.find(conditions));

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
      }
    ]
  }
});

Meteor.publish("roster", function() {
  return Users.find({"profile.type": 'Users'}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("contacts", function() {
  return Users.find({"profile.type": 'Contacts'}, {fields: {emails: 1, profile: 1}});
});
