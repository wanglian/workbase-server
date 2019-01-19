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
// - reacts: like [userId]
// - updateUserId
Messages = new Mongo.Collection('messages');

Messages.helpers({
  user() {
    return Users.findOne(this.userId);
  },
  updateUser() {
    return Users.findOne(this.updateUserId);
  },
  thread() {
    return Threads.findOne(this.threadId);
  },
  parent() {
    return Messages.findOne(this.parentId);
  },
  summaryLocalized(lang) {
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

    let key = "No content";

    if (Meteor.isClient) {
      return I18n.t(key);
    } else {
      return I18n.getFixedT(lang)(key);
    }
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
  }
});

let _messageTypes = {};
MessageTypes = {
  add(type, defs) {
    let _obj = {};
    _obj[type] = defs;
    _.extend(_messageTypes, _obj);
  },
  get(type) {
    return _messageTypes[type];
  }
};

MessageTypes.add('text');
MessageTypes.add('html');
MessageTypes.add('image', {
  summaryLocalized(message, lang) {
    if (!_.isEmpty(message.summary)) {
      return message.summary;
    }

    let key = 'Image Message';

    if (Meteor.isClient) {
      return I18n.t(key);
    } else {
      return I18n.getFixedT(lang)(key);
    }
  }
});
MessageTypes.add('log', {
  summaryLocalized(message, lang) {
    let s = message.summary;
    let log = LogTypes.get(s.action);
    let key = log.i18nKey;
    let params = s.params;

    if (Meteor.isClient) {
      return I18n.t(key, params);
    } else {
      return I18n.getFixedT(lang)(key, params);
    }
  }
});

let _logTypes = {}; // i18nKey
LogTypes = {
  add(type, defs) {
    let _obj = {};
    _obj[type] = defs;
    _.extend(_logTypes, _obj);
  },
  get(type) {
    return _logTypes[type];
  }
};
