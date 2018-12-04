import i18next from 'i18next';

Template.registerHelper('_', (key, options) => {
  return i18next.t(key, options.hash);
});

Template.registerHelper('countUnread', function() {
  return Counts.get('count-unread-inbox');
});

let moment = require('moment');
const formattedDate = function(date, format) {
  date = moment(date);
  if (format === 'simple') {
    // today
    if (date.isBetween(moment().startOf('day'), moment().endOf('day'))) {
      return date.format('HH:mm');
    }
    // this week
    if (date.isBetween(moment().startOf('week'), moment().endOf('week'))) {
      return date.format('ddd');
    }
    // this month
    if (date.isBetween(moment().startOf('month'), moment().endOf('month'))) {
      return date.format('MM-DD');
    }
    // this year
    if (date.isBetween(moment().startOf('year'), moment().endOf('year'))) {
      return date.format('MM-DD');
    }
    return date.format('l');
  } else if (format === 'simpleDayWithTime') {
    // today
    if (date.isBetween(moment().startOf('day'), moment().endOf('day'))) {
      return date.format('a h:mm');
    }
    // yesterday
    if (date.isBetween(moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day'))) {
      return date.format('昨天 ah:mm');
    }
    // this week
    if (date.isBetween(moment().startOf('week'), moment().endOf('week'))) {
      return date.format('ddd a h:mm');
    }
    // this month
    if (date.isBetween(moment().startOf('month'), moment().endOf('month'))) {
      return date.format('MM-DD a h:mm');
    }
    // this year
    if (date.isBetween(moment().startOf('year'), moment().endOf('year'))) {
      return date.format('MM-DD a h:mm');
    }
    return date.format('YYYY-MM-DD HH:mm');
  } else {
    return date.format(format);
  }
};

Template.registerHelper('formattedDate', formattedDate);