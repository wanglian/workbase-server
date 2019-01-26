
const MIN_THREADS = 20;
const MAX_THREADS = 200;
Meteor.publishComposite("threads.star", function(options) {
  check(options, Match.Maybe({
    limit: Match.Maybe(Number)
  }));

  let conditions = {star: true, userType: 'Users', userId: this.userId};
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
