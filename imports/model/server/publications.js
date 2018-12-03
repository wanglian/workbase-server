Meteor.publish("threads", function() {
  ThreadUsers.find({userType: 'Meteor.users', userId: this.userId}).forEach((tu) => {
    let thread = Threads.findOne(tu.threadId);
    let message = thread.lastMessage();
    this.added("threads", tu.threadId, {
      category: thread.category,
      subject: thread.subject,
      read: tu.read,
      lastMessageId: thread.lastMessageId,
      updatedAt: message && message.createdAt
    });
    if (message) {
      this.added("messages", message._id, {
        threadId: message.threadId,
        content: message.summary,
        createdAt: message.createdAt
      });
    }
  });
  this.ready();
});

Meteor.publish('instance', function() {
  if (!this.userId) return this.ready();

  Counts.publish(this, 'count-unread-inbox', ThreadUsers.find({userType: 'Meteor.users', userId: this.userId, read: {$ne: true}}));
  return;
});
