import moment from "moment";

MessageRecords = new Mongo.Collection("message-records");
MessageStatRecords = new Mongo.Collection("message-daily-records");

MessageRecords.rawCollection().createIndex({year: 1, month: 1, day: 1, hour: 1});
MessageStatRecords.rawCollection().createIndex({year:  1});
MessageStatRecords.rawCollection().createIndex({month: 1});
MessageStatRecords.rawCollection().createIndex({day:   1});
MessageStatRecords.rawCollection().createIndex({hour:  1});

MessageStatRecords.stat = (record) => {
  let [year, month, day, hour] = [record.year, record.month, record.day, record.hour];
  let [modifier, countInternal, countOutgoing, countIncoming] = [null, 0, 0, 0];
  if (record.internal) {
    modifier = {countInternal: 1};
    countInternal = 1;
  } else if (record.userType === "Contacts") {
    modifier = {countIncoming: 1};
    countIncoming = 1;
  } else {
    modifier = {countOutgoing: 1};
    countOutgoing = 1;
  }

  let stat = MessageStatRecords.findOne({year, month, day, hour});
  if (stat) {
    MessageStatRecords.update(stat._id, {$inc: modifier, $set: {updatedAt: new Date()}});
  } else {
    MessageStatRecords.insert({year, month, day, hour, countInternal, countOutgoing, countIncoming, createdAt: new Date()});
  }
};

MessageStatRecords.queryByDays = async (days) => {
  let d = moment();
  result = {
    internal: [],
    outgoing: [],
    incoming: []
  };
  while (days > 0) {
    let [year, month, day] = [d.year(), d.month() + 1, d.date()];
    let re = await MessageStatRecords.rawCollection().aggregate([
      {$match: {year, month, day}},
      {$group: {
        _id: d.valueOf(),
        countInternal: {$sum: "$countInternal"},
        countOutgoing: {$sum: "$countOutgoing"},
        countIncoming: {$sum: "$countIncoming"}
      }}
    ]).toArray();
    result.internal.unshift(re.length > 0 ? re[0].countInternal : 0);
    result.outgoing.unshift(re.length > 0 ? re[0].countOutgoing : 0);
    result.incoming.unshift(re.length > 0 ? re[0].countIncoming : 0);
    d.subtract(1, "days");
    days --;
  }
  return result;
};

MessageStatRecords.queryByHours = async (days) => {
  let d = moment();
  result = {
    internal: [],
    outgoing: [],
    incoming: []
  };
  for(let i = 0; i < 24; i ++) {
    let [year, month, day] = [d.year(), d.month() + 1, d.date()];
    let re = await MessageStatRecords.rawCollection().aggregate([
      {$match: {hour: i}},
      {$sort: {createdAt: -1}},
      {$limit: days},
      {$group: {
        _id: i,
        countInternal: {$sum: "$countInternal"},
        countOutgoing: {$sum: "$countOutgoing"},
        countIncoming: {$sum: "$countIncoming"}
      }}
    ]).toArray();
    result.internal.push(re.length > 0 ? re[0].countInternal : 0);
    result.outgoing.push(re.length > 0 ? re[0].countOutgoing : 0);
    result.incoming.push(re.length > 0 ? re[0].countIncoming : 0);
    d.subtract(1, "days");
    days --;
  }
  return result;
};

MessageRecords.after.insert(function(userId, doc) {
  MessageStatRecords.stat(doc);
});
