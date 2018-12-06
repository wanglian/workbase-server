Meteor.publish('instance', function() {
  if (!this.userId) return this.ready();

  Counts.publish(this, 'count-unread-inbox', ThreadUsers.find({userType: 'Users', userId: this.userId, read: false}));
  return this.ready();
});

Meteor.publishComposite("threads", function() {
  return {
    find() {
      return ThreadUsers.find({userType: 'Users', userId: this.userId}, {sort: {updatedAt: -1}});
    },
    children: [
      {
        find(tu) {
          return Threads.find({_id: tu.threadId}, {
            transform: (doc) => {
              doc.read = tu.read;
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
    ThreadUsers.find({threadId}, {fields: {threadId: 1, userType: 1, userId: 1}}),
    Users.find({_id: {$in: userIds}}, {fields: {profile: 1}}),
    Contacts.find({_id: {$in: contactIds}})
  ]
});

Meteor.publish("messages", function(threadId) {
  check(threadId, String);

  return Messages.find({threadId}, {sort: {createdAt: -1}});
});