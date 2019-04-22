import './message-day-chart';

ThreadCategories.add("Charts", {
  icon: "fa fa-bar-chart",
  iconUnread: "fa fa-bar-chart",
  title(thread) {
    return I18n.t(thread.subject);
  },
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  actions() {
    return [
      {
        title: I18n.t('report_daily_counts'),
        icon: "fa fa-bar-chart",
        action() {
          Modal.show('MessagesDailyChart', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('report_hourly_counts'),
        icon: "fa fa-bar-chart",
        action() {
          Modal.show('MessagesHourlyChart', null, {
            backdrop: 'static'
          });
        }
      }
    ]
  }
});