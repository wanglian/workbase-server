import './files';

Meteor.publish("thread.files.pending", function(threadId) {
  check(threadId, String);
  return Files.find({"meta.relations": {$elemMatch: {threadId, userId: this.userId, messageId: null}}}).cursor;
});

Meteor.methods({
  "files.remove"(id) {
    check(id, String);
    Files.remove({_id: id, userId: this.userId}, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("file removed: " + id);
      }
    });
  }
});
