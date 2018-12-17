// - threadId
// - userType: user, contact
// - userId
// - internal: boolean
// - content
// - contentType: text/html/image
// - fileIds: [fileId]
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
    return this.contentType === 'image' && this.fileIds && Files.findOne(this.fileIds[0]);
  }
});
