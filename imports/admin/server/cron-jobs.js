import moment from 'moment';

SyncedCron.add({
  name: "Crunch some important numbers for the marketing department",
  schedule(parser) {
    // parser is a later.parse object
    return parser.text("5 0 * * ? *");
  },
  job() {
    let d = moment().subtract(1, "days");
    MessageDailyRecords.stat(d.year(), d.month() + 1, d.date());
  }
});

SyncedCron.start();
