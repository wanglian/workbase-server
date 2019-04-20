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

export { MessageTypes };