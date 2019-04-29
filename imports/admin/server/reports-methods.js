import moment from 'moment';

Meteor.methods({
  getChartDay() {
    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    let records = MessageDailyRecords.find({}, {limit: 30, sort: {createdAt: -1}});
    let data = {};
    data.internal = records.map((d) => d.countInternal);
    data.outgoing = records.map((d) => d.countOutgoing);
    data.incoming = records.map((d) => d.countIncoming);
    return data;
  },
  getCharHour() {
    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    let d = moment();
    let hours = Array.from(Array(24).keys());
    let data = {};
    data.internal = hours.map((hour) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, hour, internal: true}).count();
    });
    data.outgoing = hours.map((hour) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, hour, internal: false, userType: 'Users'}).count();
    });
    data.incoming = hours.map((hour) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, hour, userType: 'Contacts'}).count();
    });
    return data;
  }
});
