// - threadId
// - userType: Users, Contacts
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
  summaryLocalized() {
    clientOnly();

    if (_.isEmpty(this.summary)) {
      return I18n.t("No content");
    }

    switch(this.contentType) {
    case 'image':
      return I18n.t('Image Message');
    default:
      return this.summary;
    }
  },
  image() {
    return this.contentType === 'image' && this.inlineFileIds && Files.findOne(this.inlineFileIds[0]);
  },
  files() {
    return this.fileIds && Files.find({_id: {$in: this.fileIds}});
  }
});
