Meteor.publish('instance', function() {
  if (this.userId){
    Counts.publish(this, 'count-unread-inbox', ThreadUsers.find({userType: 'Users', userId: this.userId, read: false}));
  }

  ChannelUsers.find({userId: this.userId}).forEach((cu) => {
    Counts.publish(this, `count-unread-channel-${cu.channelId}`, ThreadUsers.find({userType: 'Channels', userId: cu.channelId, read: false}));
  });

  return Instance.find({}, {fields: {domain: 1, company: 1, adminId: 1}});
});

const MIN_THREADS = 20;
const MAX_THREADS = 200;
Meteor.publishComposite("threads", function(options) {
  check(options, {
    category: Match.Maybe(String),
    limit: Match.Maybe(Number)
  });

  let conditions = {userType: 'Users', userId: this.userId};
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
                  return eval(message.userType).find({_id: message.userId});
                }
              }
            ]
          }
        ]
      }
    ]
  };
});

Meteor.publish("thread", function(threadId) {
  check(threadId, String);

  let userIds = ThreadUsers.find({threadId, userType: 'Users'}).map(tu => tu.userId);
  let contactIds = ThreadUsers.find({threadId, userType: 'Contacts'}).map(tu => tu.userId);

  return [
    Threads.find({_id: threadId}),
    ThreadUsers.find({threadId}, {fields: {read: 0}}),
    Users.find({_id: {$in: userIds}}, {fields: {emails: 1, profile: 1}}),
    Contacts.find({_id: {$in: contactIds}})
  ]
});

const MIN_MESSAGES = 20;
const MAX_MESSAGES = 1000;
Meteor.publish("messages", function(threadId, options) {
  check(threadId, String);
  check(options, {
    limit: Match.Maybe(Number)
  });

  let limit = options && options.limit || MIN_MESSAGES;

  let countName = `messages.${threadId}`;
  Counts.publish(this, countName, Messages.find({threadId}, {sort: {createdAt: -1}}));

  return Messages.find({threadId}, {
    sort: {createdAt: -1},
    limit: Math.min(limit, MAX_MESSAGES)
  });
});

Meteor.publish("roster", function() {
  return Users.find({"profile.channel": {$ne: true}}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("contacts", function() {
  return Contacts.find({}, {fields: {email: 1, profile: 1}});
});
