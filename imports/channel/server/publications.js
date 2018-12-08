Meteor.publishComposite('channels', function() {
  if (!this.userId) return this.ready();

  return {
    find() {
      return ChannelUsers.find({userId: this.userId});
    },
    children: [
      {
        find(channelUser) {
          return Users.find({_id: channelUser.channelId}, {fields: {emails: 1, profile: 1}})
        }
      }
    ]
  };
});

Meteor.publishComposite('channel.members', function(channel) {
  check(channel, String);
  if (!this.userId) return this.ready();

  return {
    find() {
      return ChannelUsers.find({channelId: channel});
    },
    children: [
      {
        find(channelUser) {
          return Users.find({_id: channelUser.userId}, {fields: {emails: 1, profile: 1}})
        }
      }
    ]
  };
});

Meteor.publishComposite("channel.threads", function(channel) {
  check(channel, String);

  if (!ChannelUsers.hasMember(channel, this.userId)) {
    return this.ready();
  }

  return {
    find() {
      return ThreadUsers.find({userType: 'Channels', userId: channel}, {sort: {updatedAt: -1}});
    },
    children: [
      {
        find(tu) {
          return Channels.find({_id: tu.userId});
        }
      },
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
