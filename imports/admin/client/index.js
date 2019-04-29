import "./admin";
import "./settings";
import "./roster";
import "./reports";

ThreadCategories.add("Settings", {
  icon: "fa fa-cogs",
  iconUnread: "fa fa-cogs",
  title(thread) {
    return I18n.t(thread.subject);
  },
  details: ["Members", "Search", "PinMessages", "Files"],
  actions() {
    return [
      {
        title: I18n.t("settings_company"),
        icon: "fa fa-building-o",
        action() {
          Modal.show("SettingCompanyModal");
        }
      },
      {
        title: I18n.t("settings_email"),
        icon: "fa fa-envelope-o",
        action() {
          Modal.show("SettingEmailModal");
        }
      },
      {
        title: I18n.t("settings_storage"),
        icon: "fa fa-cloud",
        action() {
          Modal.show("SettingStorageModal");
        }
      }
    ];
  }
});

ThreadCategories.add("Roster", {
  icon: "fa fa-address-book",
  iconUnread: "fa fa-address-book",
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  title(thread) {
    return I18n.t(thread.subject);
  },
  actions() {
    return [
      {
        title: I18n.t('users_list'),
        icon: "fa fa-list-ul",
        action() {
          Modal.show('RosterListModal', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('users_action_new'),
        icon: "fa fa-user-plus",
        action() {
          Modal.show('AddRosterModal', null, {
            backdrop: 'static'
          });
        }
      }
    ];
  }
});

ThreadCategories.add("Charts", {
  icon: "fa fa-bar-chart",
  iconUnread: "fa fa-bar-chart",
  title(thread) {
    return I18n.t(thread.subject);
  },
  details: ["Members", "Search", "PinMessages", "Files"],
  actions() {
    return [
      {
        title: I18n.t("report_daily_counts"),
        icon: "fa fa-bar-chart",
        action() {
          Modal.show("MessagesDailyChart", null, {
            backdrop: "static"
          });
        }
      },
      {
        title: I18n.t("report_hourly_counts"),
        icon: "fa fa-bar-chart",
        action() {
          Modal.show("MessagesHourlyChart", null, {
            backdrop: "static"
          });
        }
      }
    ];
  }
});

AdminController = ApplicationController.extend({
  template: "Admin",
  subscriptions() {
    this.threadsSub = this.subscribe("admin.threads");
    let threadId = this.threadId();
    if (threadId) {
      this.subscribe("thread", threadId);
      this.subscribe("thread.files.pending", threadId);
    }
  },
  threadId() {
    return this.params._id;
  },
  detail() {
    return this.params.query.detail;
  },
  thread() {
    let threadId = this.threadId();
    return threadId && Threads.findOne(threadId);
  },
  data() {
    let query = _.clone(this.params.query);
    let thread = this.thread();
    return {
      threads:    Threads.find({scope: "admin"}, {sort: {updatedAt: -1}}),
      thread,
      ready:      this.threadsSub.ready(),
      hasRight:   !!thread,
      hasSidebar: !!thread && thread.showDetails && !!this.params.query.detail
    };
  }
});

Router.route("/admin/:_id?", {
  name: "admin",
  controller: "AdminController"
});
