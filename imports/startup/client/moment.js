let moment = require('moment');
require('moment/locale/zh-cn');

// i18n
moment.locale(currentLanguage().toLowerCase());

Template.registerHelper('formatSimpleDate', (date) => {
  return moment(date).calendar(null, {
    sameDay: 'HH:mm',
    nextDay: `[${I18n.t('Tomorrow')}]`,
    nextWeek: 'MM-DD',
    lastDay: `[${I18n.t('Yesterday')}]`,
    lastWeek: 'dddd',
    sameElse: 'YYYY-MM-DD'
  });
});

Template.registerHelper('formatDayWithTime', (date) =>  {
  return moment(date).calendar(null, {
    sameDay: `[${I18n.t('Today')}] HH:mm`,
    nextDay: `[${I18n.t('Tomorrow')}] HH:mm`,
    nextWeek: 'MM-DD HH:mm',
    lastDay: `[${I18n.t('Yesterday')}] HH:mm`,
    lastWeek: 'dddd HH:mm',
    sameElse: 'YYYY-MM-DD HH:mm'
  });
});
