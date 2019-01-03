// - threadId
// - userType: Users, Contacts
// - userId
// - internal: boolean
// - content
// - contentType: text/html/image/log
// - parentId:
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
  parent() {
    return Messages.findOne(this.parentId);
  },
  summaryLocalized(lang) {
    if (!_.isEmpty(this.summary)) {
      return this.summary;
    }

    let key;
    switch(this.contentType) {
    case 'image':
      key = 'Image Message';
      break;
    default:
      key = "No content";
    }

    if (Meteor.isClient) {
      return I18n.t(key);
    } else {
      return I18n.getFixedT(lang)(key);
    }
  },
  image() {
    return this.contentType === 'image' && this.inlineFileIds && Files.collection.findOne(this.inlineFileIds[0]);
  },
  files() {
    return this.fileIds && Files.find({_id: {$in: this.fileIds}});
  }
});
