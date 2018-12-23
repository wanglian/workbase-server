import './files';
import './avatar-files';

Files.collection.before.insert(function(userId, doc) {
  _.extend(doc, {createdAt: new Date()});
});

Messages.after.insert(function(userId, doc) {
  if (doc.fileIds) {
    Files.update({
      "meta.relations.threadId":  doc.threadId,
      "meta.relations.userType":  doc.userType,
      "meta.relations.userId":    doc.userId,
      "meta.relations.type":      'file',
      "meta.relations.messageId": null,
    }, {
      $set: {"meta.relations.$.messageId": this._id}
    }, {"multi": true});
  }
  if (doc.inlineFileIds) {
    Files.update({
      "meta.relations.threadId":  doc.threadId,
      "meta.relations.userType":  doc.userType,
      "meta.relations.userId":    doc.userId,
      "meta.relations.type":      'inline',
      "meta.relations.messageId": null,
    }, {
      $set: {"meta.relations.$.messageId": this._id}
    }, {"multi": true});
  }
});

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
