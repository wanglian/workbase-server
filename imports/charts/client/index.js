import './message-day-chart';
import './settings';

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

ThreadCategories.add("Settings", {
  icon: "fa fa-cogs",
  iconUnread: "fa fa-cogs",
  title(thread) {
    return I18n.t(thread.subject);
  },
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  actions() {
    return [
      {
        title: I18n.t('settings_company'),
        icon: "fa fa-building-o",
        action() {
          Modal.show('SettingCompanyModal', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('settings_email'),
        icon: "fa fa-envelope-o",
        action() {
          Modal.show('SettingEmailModal', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('settings_storage'),
        icon: "fa fa-cloud",
        action() {
          Modal.show('SettingStorageModal', null, {
            backdrop: 'static'
          });
        }
      }
    ]
  }
});