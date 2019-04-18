import './message-day-chart';

ThreadCategories.add("Charts", {
  icon: "fa fa-bar-chart",
  iconUnread: "fa fa-bar-chart",
  title(thread) { // client only
    return I18n.t(thread.subject);
  },
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  actions() {
    return [
      {
        title: I18n.t('Daily Messages Counts'),
        icon: "fa fa-bar-chart",
        action() {
          Modal.show('MessagesDailyChart', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('Hourly Messages Counts'),
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