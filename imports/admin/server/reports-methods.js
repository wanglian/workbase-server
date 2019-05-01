Meteor.methods({
  getChartDay() {
    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    return MessageStatRecords.queryByDays(30);
  },
  getCharHour() {
    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    return MessageStatRecords.queryByHours(30);
  }
});
