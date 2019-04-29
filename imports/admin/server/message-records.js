MessageRecords = new Mongo.Collection('message-records');
MessageDailyRecords = new Mongo.Collection('message-daily-records');

MessageRecords.rawCollection().createIndex({year: 1});
MessageRecords.rawCollection().createIndex({month: 1});
MessageRecords.rawCollection().createIndex({day: 1});
MessageRecords.rawCollection().createIndex({internal: 1});
MessageRecords.rawCollection().createIndex({userType: 1});
MessageDailyRecords.rawCollection().createIndex({year: 1, month: 1, day: 1});

MessageDailyRecords.stat = (year, month, day) => {
  let countInternal = MessageRecords.find({year, month, day, internal: true}).count();
  let countOutgoing = MessageRecords.find({year, month, day, internal: false, userType: 'Users'}).count();
  let countIncoming = MessageRecords.find({year, month, day, userType: 'Contacts'}).count();

  let record = MessageDailyRecords.findOne({year, month, day});
  if (record) {
    MessageDailyRecords.update({year, month, day}, {$set: {countInternal, countOutgoing, countIncoming}});
  } else {
    MessageDailyRecords.insert({year, month, day, countInternal, countOutgoing, countIncoming, createdAt: new Date()});
  }

  return countInternal + countOutgoing + countIncoming;
};
