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
// - email: subject, from, to, cc, bcc, time
// - reacts: like [userId]
// - updateUserId
// - pinAt
// - pinUserId
// - createdAt
// - updatedAt

import { MessageTypes } from './message-types';
import lodash from 'lodash';
const _ = lodash;

Messages = new Mongo.Collection('messages');

Messages.helpers({
  user() {
    return Users.findOne(this.userId);
  },
  updateUser() {
    return Users.findOne(this.updateUserId);
  },
  pinUser() {
    return Users.findOne(this.pinUserId);
  },
  thread() {
    return Threads.findOne(this.threadId);
  },
  parent() {
    return Messages.findOne(this.parentId);
  },
  hasReact(userId, action) {
    return this.reacts && this.reacts[action] && this.reacts[action].includes(userId);
  },
  countReact(action) {
    return this.reacts && this.reacts[action] && this.reacts[action].length;
  },
  image() {
    return this.contentType === 'image' && this.inlineFileIds && Files.collection.findOne(this.inlineFileIds[0]);
  },
  files() {
    return this.fileIds && Files.find({_id: {$in: this.fileIds}});
  },
  localizedSummary(lang) {
    try {
      let t = MessageTypes.get(this.contentType);
      if (t && t.summaryLocalized) {
        return t.summaryLocalized(this, lang);
      }
    } catch (e) {
      // console.log(e);
    }

    if (!_.isEmpty(this.summary)) {
      return this.summary;
    }

    let key = "message_no_content";

    if (Meteor.isClient) {
      return I18n.t(key);
    } else {
      return I18n.getFixedT(lang)(key);
    }
  }
});

export { Messages };