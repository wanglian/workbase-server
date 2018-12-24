// - threadId
// - userType: user, contact
// - userId
// - internal: boolean
// - content
// - contentType: text/html/image/log
// - fileIds: [fileId]
// - inlineFileIds: [fileId]
// - summary
// - emailId
// - email: from, to, cc, time
Messages = new Mongo.Collection('messages');

Messages.helpers({
  user() {
    return eval(this.userType).findOne(this.userId);
  },
  thread() {
    return Threads.findOne(this.threadId);
  },
  image() {
    return this.contentType === 'image' && this.inlineFileIds && Files.findOne(this.inlineFileIds[0]);
  },
  files() {
    return this.fileIds && Files.find({_id: {$in: this.fileIds}});
  }
});
