const MIN_THREADS = 20;
const MAX_THREADS = 200;

const publishThread = function(publisher, type, options) {
  let conditions = {userType: 'Users', userId: publisher.userId};
  switch (type) {
  case 'star':
    _.extend(conditions, {star: true});
    break;
  case 'archive':
    _.extend(conditions, {archive: true});
    break;
  case 'spam':
    _.extend(conditions, {spam: true});
    break;
  default:
    return publisher.ready();
  }
  let limit = options && options.limit || MIN_THREADS;
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
              doc.spam = tu.spam;
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
};

Meteor.publishComposite("threads.star", function(options) {
  check(options, Match.Maybe({
    limit: Match.Maybe(Number)
  }));

  return publishThread(this, 'star', options);
});

Meteor.publishComposite("threads.archive", function(options) {
  check(options, Match.Maybe({
    limit: Match.Maybe(Number)
  }));

  return publishThread(this, 'archive', options);
});

Meteor.publishComposite("threads.spam", function(options) {
  check(options, Match.Maybe({
    limit: Match.Maybe(Number)
  }));

  return publishThread(this, 'spam', options);
});
